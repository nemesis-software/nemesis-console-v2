export default {
  blog_entry: {
    mainView: [{name: 'code'}, {name: 'title'}, {name: 'content'}],
    sideBar: [
      {groupName: 'Status', items: [{name: 'publishDate'}, {name: 'entity-categories'}]},
      {groupName: 'Images', items: [{name: 'entity-picture'}, {name: 'entity-thumbnail', embeddedCreation: true}]},
      {groupName: 'Addition fields', items: [{name: 'teaser'}, {name: 'socialMetadataAttributes'}]},
    ]
  },
  media: {
    mainView: [{name: 'code'}, {name: 'entity-mediaFolder', embeddedCreation: true}, {name: 'previewUrl'}]
  },
  media_folder: {
    mainView: [{name: 'code'}, {name: 'name'}, {name: 'entity-parent'}]
  }
}