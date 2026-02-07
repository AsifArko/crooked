import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pageView',
  title: 'Page View',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'url', type: 'string', title: 'URL'}),
    defineField({name: 'sessionId', type: 'string', title: 'Session ID'}),
    defineField({name: 'ipAddress', type: 'string', title: 'IP Address'}),
    defineField({name: 'hostname', type: 'string', title: 'Hostname'}),
    defineField({name: 'userAgent', type: 'string', title: 'User Agent'}),
    defineField({name: 'loadTimeMs', type: 'number', title: 'Load Time (ms)'}),
    defineField({name: 'referrer', type: 'string', title: 'Referrer'}),
    defineField({name: 'recordedAt', type: 'datetime', title: 'Recorded At'}),
  ],
})
