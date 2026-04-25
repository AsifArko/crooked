import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'resumeDownload',
  title: 'Resume Download',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'ipAddress', type: 'string', title: 'IP Address'}),
    defineField({name: 'hostname', type: 'string', title: 'Hostname'}),
    defineField({name: 'userAgent', type: 'string', title: 'User Agent'}),
    defineField({name: 'sessionId', type: 'string', title: 'Session ID'}),
    defineField({name: 'referrer', type: 'string', title: 'Referrer'}),
    defineField({name: 'recordedAt', type: 'datetime', title: 'Recorded At'}),
  ],
})
