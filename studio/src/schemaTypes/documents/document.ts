import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'docFile',
  title: 'Document File',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Document Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'A friendly name to reference this document by',
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      validation: (Rule) => Rule.required(),
      options: {
        accept: '.pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.svg',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Resume', value: 'resume'},
          {title: 'Research', value: 'research'},
          {title: 'Portfolio', value: 'portfolio'},
          {title: 'Certificate', value: 'certificate'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this document should be publicly accessible',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      isPublic: 'isPublic',
    },
    prepare(selection) {
      const {title, category, isPublic} = selection
      return {
        title,
        subtitle: `${category} - ${isPublic ? 'Public' : 'Private'}`,
      }
    },
  },
})
