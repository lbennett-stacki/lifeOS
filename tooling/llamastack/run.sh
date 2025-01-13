INFERENCE_MODEL="meta-llama/Llama-3.2-3B-Instruct"
OLLAMA_INFERENCE_MODEL="llama3.2:3b-instruct-fp16"
LLAMA_STACK_PORT=5001

if ! command -v ollama &>/dev/null; then
  echo "❌🦙 ollama not found. please install it."
  exit 1
fi

if ! command -v docker &>/dev/null; then
  echo "❌🐋 docker not found. please install it."
  exit 1
fi

ollama run $OLLAMA_INFERENCE_MODEL --keepalive 60m

docker run \
  -it \
  -p $LLAMA_STACK_PORT:$LLAMA_STACK_PORT \
  -v ~/.llama:/root/.llama \
  llamastack/distribution-ollama \
  --port $LLAMA_STACK_PORT \
  --env INFERENCE_MODEL=$INFERENCE_MODEL \
  --env OLLAMA_URL=http://host.docker.internal:11434
