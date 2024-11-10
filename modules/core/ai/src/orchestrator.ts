import 'dotenv/config';
import fetch from 'node-fetch';
import { AgentApp, AgentGraph } from '@lifeos/ai';
import { RootAgentModule } from './agents/module.js';

type OrchestrationAction<R = any> = {
  intent: string;
  args: string[];
  resolvedArgs: Array<string | null>;
  result: R;
};

const apis = {
  intent: 'http://localhost:6000/predict',
  entity: 'http://localhost:6001/predict',
  generate: 'http://localhost:6002/predict',
};

class Orchestrator {
  constructor(
    root: AgentApp['root'],
    private readonly app = new AgentApp(root),
    private readonly graph = new AgentGraph(root),
  ) {}

  async orchestrate(input: string): Promise<OrchestrationAction> {
    const resolved = await this.predict(input);

    const { propertyKey, providerKey } = this.graph.getAction(resolved.intent);

    const provider = this.app.resolve(providerKey);

    const result = await provider[propertyKey](...resolved.resolvedArgs);

    return { ...resolved, result };
  }

  async predict(
    input: string,
  ): Promise<Pick<OrchestrationAction, 'intent' | 'args' | 'resolvedArgs'>> {
    const intent = await this.predictIntent(input);
    const args: OrchestrationAction['args'] = this.graph.listArgs(intent);
    const extractedArgs = await Promise.all(
      args.map((arg) => (arg ? this.predictEntity(input, arg) : null)),
    );

    const { resolved: extracted, unresolved: notExtracted } =
      this.calculateResolvedUnresolved(args, extractedArgs);

    const resolvedCountExtracted = extracted.filter(
      (arg) => arg !== null,
    ).length;

    if (resolvedCountExtracted === args.length) {
      return { intent, args, resolvedArgs: extracted };
    }

    // TODO:
    /**
     *
     * Try to extract unresolved args with generalized entity extractor.
     *
     * Again check that all are resolved, return if they are.
     */
    const generalizedNotExtracted = notExtracted;

    /**
     *
     * Before generating any args, we should first use a reasoning model to understand if there are any sub-intents that we should run, like collecting extra data or information from other intents
     *
     */

    const generatedArgsSettled = await Promise.allSettled(
      generalizedNotExtracted.map((arg) =>
        arg === null ? null : this.generateEntity(arg, input),
      ),
    );

    const generatedArgs = generatedArgsSettled.reduce<Array<string | null>>(
      (result, settled, index) => {
        const newResult = [...result];

        if (
          settled.status === 'fulfilled' &&
          (typeof settled.value === 'string' || settled.value === null)
        ) {
          newResult[index] = settled.value;
        }

        return newResult;
      },
      [],
    );

    const generateMergedArgs = this.mergeArgs(generatedArgs, extractedArgs);

    const { resolved: generated, unresolved: notGenerated } =
      this.calculateResolvedUnresolved(args, generateMergedArgs);

    const generateMergedResolvedArgs = this.mergeArgs(generated, extracted);

    const resolvedCountGenerated = generateMergedResolvedArgs.length;

    if (resolvedCountGenerated === args.length) {
      return {
        intent,
        args,
        resolvedArgs: generateMergedResolvedArgs,
      };
    }

    throw new Error('Could not resolve all args');

    // TODO:
    /**
     * Otherwise, we ask the user to provde the unresolved args.
     *
     * Again check that all are resolved, return if they are.
     */

    /**
     * Otherwise, throw an error.
     *
     */
  }

  private calculateResolvedUnresolved(
    args: string[],
    resolutions: (string | null)[],
  ) {
    return args.reduce<{
      resolved: OrchestrationAction['resolvedArgs'];
      unresolved: OrchestrationAction['resolvedArgs'];
    }>(
      ({ resolved, unresolved }, arg, index) => {
        const nextResolvedArgs = [...resolved];
        const nextUnresolvedArgs = [...unresolved];
        const extractedArg = resolutions[index];

        if (extractedArg === null) {
          nextUnresolvedArgs[index] = arg ?? null;
          nextResolvedArgs[index] = null;
        } else {
          nextUnresolvedArgs[index] = null;
          nextResolvedArgs[index] = extractedArg;
        }

        return {
          resolved: nextResolvedArgs,
          unresolved: nextUnresolvedArgs,
        };
      },
      {
        resolved: [],
        unresolved: [],
      },
    );
  }

  private mergeArgs(a: Array<string | null>, b: Array<string | null>) {
    const newArgs = a.reduce<Array<string | null>>((result, arg, index) => {
      const newResult = [...result];

      newResult[index] = b[index] ?? arg ?? null;

      return newResult;
    }, []);

    return newArgs;
  }

  private async predictIntent(input: string): Promise<string> {
    const response = await fetch(apis.intent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      throw new Error('Failed to predict intent');
    }

    // TODO: run param validators
    const result = (await response.json()) as [string, number[]];

    return result[0];
  }

  private async predictEntity(
    input: string,
    type: string,
  ): Promise<string | null> {
    // TODO: temporary entity id map, in future will be handled automagically
    const entityDescriptionToTypeMap = {
      'the recipients email address': 'email',
    };

    const response = await fetch(apis.entity, {
      method: 'POST',
      headers: {
        contentType: 'application/json',
      },
      body: JSON.stringify({ input, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract entity');
    }

    // TODO: run param validators
    const result = (await response.json()) as Array<[string, string, number]>;

    const entityType = entityDescriptionToTypeMap[type];

    const decoded = this.decodePredictedEntity(entityType, result);

    return decoded;
  }

  private async generateEntity(
    generatable: string,
    scenario: string,
  ): Promise<string | null> {
    const response = await fetch(apis.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ generatable, scenario }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate entity');
    }

    // TODO: run param validators
    const result = (await response.json()) as string;

    return result;
  }

  private decodePredictedEntity(
    type: string,
    data: Array<[string, string, number]>,
  ): string | null {
    let decoded: string | null = null;

    const bioLabels = {
      begin: `B-${type}`,
      inside: `I-${type}`,
      outside: 'O',
    };

    for (const [token, label, _confidence] of data) {
      const normalToken = token.replace(/^##/, '');

      if (decoded === null) {
        if (label === bioLabels.begin) {
          decoded = normalToken;
        }

        continue;
      }

      if (label === bioLabels.inside) {
        decoded += normalToken;
        continue;
      }

      break;
    }

    return decoded;
  }
}

const main = async () => {
  const orchestrator = new Orchestrator(RootAgentModule);

  const prompts = [
    "Send an email to test-user@life.os telling them I will be late to the annual shareholder meeting because I discovered a delicious cuban sandwich place. I'll be 30 minutes late but get started without me.",
    'Send an email to best-mate@emailservice.io. Ask if he would like to meet me for dinner at Canary Wharf on Friday at 7pm. Just like old times',
    'Send a message to my partner on partner@email.com. Remind them that we have a date night tonight. We are starting at the cinema, 6:30pm. But we need to look for a restaurant we can go to after.',
  ];

  for (const prompt of prompts) {
    try {
      console.log('Running orchestrate on prompt', prompt);
      const result = await orchestrator.orchestrate(prompt);

      console.log('orchestrate result', { result });
    } catch (e) {
      console.error(e);
    }
  }
};

main();
