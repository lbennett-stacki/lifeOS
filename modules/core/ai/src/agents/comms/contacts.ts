import { Agent, AgentCapability, AgentParam } from '@lifeos/ai';
import { z } from 'zod';

@Agent({
  name: 'contacts',
  description: "Access the user's contact list",
})
export class ContactsAgent {
  private readonly contacts = [
    {
      id: '1',
      firstName: 'Lukie',
      middleName: 'Frank',
      lastName: 'Bennetto',
      nicknames: ['The Creator', 'Luke'],
      relationships: ['creator', 'friend', 'foe'],
      email: 'lukie.bennetto@localhost',
      mobile: '+44000000000',
    },
    {
      id: '2',
      firstName: 'Chuckle',
      lastName: 'Buckle',
      nicknames: ['The Brother'],
      relationships: ['brother', 'friend', 'family'],
      email: 'chuckle.buckle@localhost',
      mobile: '+44000000001',
    },
  ];

  @AgentCapability("gets the user's top contacts")
  async topContacts() {
    return this.contacts;
  }

  @AgentCapability("get a user's contact details by id")
  async contactById(
    // TODO: add a cuidSchema
    @AgentParam('a contacts cuid id', z.string())
    id: string,
  ) {
    return this.contacts.find((c) => c.id === id);
  }

  @AgentCapability('fulltext search for a contact')
  async search(
    @AgentParam(
      'a contacts name, nickname or relationship to the user',
      z.string(),
    )
    query: string,
  ) {
    return this.contacts.find((c) => {
      // TODO: perform a real fulltext search
      return (
        c.firstName === query ||
        c.nicknames.includes(query) ||
        c.relationships.includes(query)
      );
    });
  }
}
