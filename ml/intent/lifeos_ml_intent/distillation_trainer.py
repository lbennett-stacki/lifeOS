from transformers import Trainer
import torch.nn.functional as F


class DistillationTrainer(Trainer):
    def __init__(
        self,
        temperature=2.0,
        alpha=0.5,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self.temperature = temperature
        self.alpha = alpha

    def compute_loss(
        self, model, inputs, return_outputs=False, num_items_in_batch=None
    ):
        labels = inputs["labels"]
        teacher_probs = inputs["teacher_probs"]

        outputs = model(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
        )
        student_logits = outputs.logits

        student_log_probs = F.log_softmax(student_logits / self.temperature, dim=-1)
        distill_loss = F.kl_div(
            student_log_probs,
            teacher_probs,
            reduction="batchmean",
        )

        ce_loss = F.cross_entropy(student_logits, labels)

        loss = self.alpha * distill_loss + (1 - self.alpha) * ce_loss

        return (loss, outputs) if return_outputs else loss
