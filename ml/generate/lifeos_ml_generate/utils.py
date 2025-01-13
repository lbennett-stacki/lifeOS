from typing import Optional


def format_prompt(
    generatable: str, scenario: str, additional_context: Optional[str], output=""
) -> str:
    formatted_input = f"Generate: {generatable}"
    formatted_input += f"\nFor the scenario: {scenario}"
    formatted_input += f"\nOutput: {output}"

    if additional_context:
        formatted_input += f"\nAdditional context: {additional_context}"

    return formatted_input
