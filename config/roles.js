module.exports = {
  administrator: {
    blog: {
      allowComments: true,
      editComments: true,
      editAllComments: true,
      deleteComments: true,
      deleteAllComments: true
    },
    forum: {
      createForums: true,
      editForums: true,
      deleteForums: true,
      createTopics: true,
      editTopics: true,
      deleteTopics: true,
      createMessages: true,
      editMessages: true,
      deleteMessage: true,
      editAllMessages: true,
      deleteAllMessages: true,
      editAllTopics: true,
      deleteAllTopics: true
    }
  },
  moderator: {
    blog: {
      allowComments: true,
      editComments: true,
      editAllComments: true,
      deleteComments: true,
      deleteAllComments: true
    },
    forum: {
      createForums: false,
      editForums: false,
      deleteForums: false,
      createTopics: true,
      editTopics: true,
      deleteTopics: true,
      createMessages: true,
      editMessages: true,
      deleteMessage: true,
      editAllMessages: true,
      deleteAllMessages: true,
      editAllTopics: true,
      deleteAllTopics: true
    }
  },
  user: {
    blog: {
      allowComments: true,
      editComments: true,
      editAllComments: false,
      deleteComments: true,
      deleteAllComments: false
    },
    forum: {
      createForums: false,
      editForums: false,
      deleteForums: false,
      createTopics: true,
      editTopics: true,
      deleteTopics: true,
      createMessages: true,
      editMessages: true,
      deleteMessage: true,
      editAllMessages: false,
      deleteAllMessages: false,
      editAllTopics: false,
      deleteAllTopics: false
    }
  },
  blocked: {
    blog: {
      allowComments: false,
      editComments: false,
      editAllComments: false,
      deleteComments: false,
      deleteAllComments: false
    },
    forum: {
      createForums: false,
      editForums: false,
      deleteForums: false,
      createTopics: false,
      editTopics: false,
      deleteTopics: false,
      createMessages: false,
      editMessages: false,
      deleteMessage: false,
      editAllMessages: false,
      deleteAllMessages: false,
      editAllTopics: false,
      deleteAllTopics: false
    }
  },
  guest: {
    blog: {
      allowComments: true,
      editComments: false,
      editAllComments: false,
      deleteComments: false,
      deleteAllComments: false
    },
    forum: {
      createForums: false,
      editForums: false,
      deleteForums: false,
      createTopics: false,
      editTopics: false,
      deleteTopics: false,
      createMessages: true,
      editMessages: false,
      deleteMessage: false,
      editAllMessages: false,
      deleteAllMessages: false,
      editAllTopics: false,
      deleteAllTopics: false
    }
  }
}