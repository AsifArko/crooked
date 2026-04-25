import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'performanceMetric',
  title: 'Performance Metric',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'metric', type: 'string', title: 'Metric'}),
    defineField({name: 'value', type: 'number', title: 'Value'}),
    defineField({name: 'url', type: 'string', title: 'URL'}),
    defineField({name: 'sessionId', type: 'string', title: 'Session ID'}),
    defineField({name: 'ipAddress', type: 'string', title: 'IP Address'}),
    defineField({name: 'hostname', type: 'string', title: 'Hostname'}),
    defineField({name: 'recordedAt', type: 'datetime', title: 'Recorded At'}),
  ],
})
