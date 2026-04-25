import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'userEvent',
  title: 'User Event',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'eventType', type: 'string', title: 'Event Type'}),
    defineField({name: 'eventName', type: 'string', title: 'Event Name'}),
    defineField({name: 'url', type: 'string', title: 'URL'}),
    defineField({name: 'sessionId', type: 'string', title: 'Session ID'}),
    defineField({name: 'ipAddress', type: 'string', title: 'IP Address'}),
    defineField({name: 'hostname', type: 'string', title: 'Hostname'}),
    defineField({name: 'metadata', type: 'text', title: 'Metadata (JSON)'}),
    defineField({name: 'recordedAt', type: 'datetime', title: 'Recorded At'}),
  ],
})
