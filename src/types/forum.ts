
export interface ForumTopic {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  repliesCount: number;
  lastReplyAt?: string;
  lastReplyBy?: string;
  tags: string[];
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  parentReplyId?: string; // pour les réponses imbriquées
  createdAt: string;
  updatedAt: string;
  isModerated: boolean;
  mentions: string[]; // IDs des utilisateurs mentionnés
  likes: number;
  likedBy: string[];
}

export interface ForumNotification {
  id: string;
  userId: string;
  type: 'mention' | 'reply' | 'new_topic' | 'moderation';
  forumTopicId: string;
  forumReplyId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
