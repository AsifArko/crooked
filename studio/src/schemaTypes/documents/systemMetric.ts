import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'systemMetric',
  title: 'System Metric',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'metricType', type: 'string', title: 'Metric Type'}),
    defineField({name: 'value', type: 'number', title: 'Value'}),
    defineField({name: 'unit', type: 'string', title: 'Unit'}),
    defineField({name: 'status', type: 'string', title: 'Status'}),
    defineField({name: 'recordedAt', type: 'datetime', title: 'Recorded At'}),
  ],
})
