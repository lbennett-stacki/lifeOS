from typing import Optional


def input_prompt(
    generatable: str, scenario: str, additional_context: Optional[str]
) -> str:
    formatted_input = f'Generate: {generatable}\nFor the scenario: "{scenario}"'

    if additional_context:
        formatted_input += f"\nAdditional context: {additional_context}"

    return formatted_input


def training_prompt(
    generatable: str,
    scenario: str,
    additional_context: Optional[str],
    output: str,
) -> str:
    formatted_input = input_prompt(generatable, scenario, additional_context)

    formatted_input += f"\n\nOutput: {output}"

    return formatted_input
