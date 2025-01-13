export interface LlmAdapter {
  prompt(input: string): Promise<string>;
}
