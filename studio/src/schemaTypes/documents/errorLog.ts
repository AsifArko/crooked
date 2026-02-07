import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'errorLog',
  title: 'Error Log',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'errorType', type: 'string', title: 'Error Type'}),
    defineField({name: 'message', type: 'string', title: 'Message'}),
    defineField({name: 'severity', type: 'string', title: 'Severity'}),
    defineField({name: 'url', type: 'string', title: 'URL'}),
    defineField({name: 'ipAddress', type: 'string', title: 'IP Address'}),
    defineField({name: 'hostname', type: 'string', title: 'Hostname'}),
    defineField({name: 'stackTrace', type: 'text', title: 'Stack Trace'}),
    defineField({name: 'status', type: 'string', title: 'Status'}),
    defineField({name: 'recordedAt', type: 'datetime', title: 'Recorded At'}),
  ],
})
