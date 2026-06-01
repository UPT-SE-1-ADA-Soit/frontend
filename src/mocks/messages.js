import { MOCK_PRODUCTS } from './products.js';
import { MOCK_USERS } from './users.js';

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv1',
    product: MOCK_PRODUCTS[0],
    buyer: MOCK_USERS[0],
    seller: MOCK_USERS[1],
    lastMessage: {
      id: 'msg3',
      senderId: 'u2',
      text: "Yes, it's still available! Can you come pick it up this weekend?",
      createdAt: '2024-05-12T14:30:00Z',
      read: false,
    },
    messages: [
      {
        id: 'msg1',
        senderId: 'u1',
        text: 'Hi! Is the denim jacket still available?',
        createdAt: '2024-05-12T14:00:00Z',
        read: true,
      },
      {
        id: 'msg2',
        senderId: 'u2',
        text: 'Hello! Yes it is, are you interested?',
        createdAt: '2024-05-12T14:15:00Z',
        read: true,
      },
      {
        id: 'msg3',
        senderId: 'u2',
        text: "Yes, it's still available! Can you come pick it up this weekend?",
        createdAt: '2024-05-12T14:30:00Z',
        read: false,
      },
    ],
    unreadCount: 1,
  },
  {
    id: 'conv2',
    product: MOCK_PRODUCTS[6],
    buyer: MOCK_USERS[0],
    seller: MOCK_USERS[1],
    lastMessage: {
      id: 'msg6',
      senderId: 'u1',
      text: 'Would you take $170 for it?',
      createdAt: '2024-05-11T10:00:00Z',
      read: true,
    },
    messages: [
      {
        id: 'msg4',
        senderId: 'u1',
        text: 'Hey, do the headphones still have warranty?',
        createdAt: '2024-05-11T09:30:00Z',
        read: true,
      },
      {
        id: 'msg5',
        senderId: 'u2',
        text: "Unfortunately the warranty expired last month, but they're in perfect shape.",
        createdAt: '2024-05-11T09:45:00Z',
        read: true,
      },
      {
        id: 'msg6',
        senderId: 'u1',
        text: 'Would you take $170 for it?',
        createdAt: '2024-05-11T10:00:00Z',
        read: true,
      },
    ],
    unreadCount: 0,
  },
  {
    id: 'conv3',
    product: MOCK_PRODUCTS[4],
    buyer: MOCK_USERS[3],
    seller: MOCK_USERS[0],
    lastMessage: {
      id: 'msg8',
      senderId: 'u4',
      text: 'Great, I can meet you at 10am Saturday!',
      createdAt: '2024-05-13T18:00:00Z',
      read: false,
    },
    messages: [
      {
        id: 'msg7',
        senderId: 'u4',
        text: 'Hi, is the bike still for sale? What size is it exactly?',
        createdAt: '2024-05-13T17:30:00Z',
        read: true,
      },
      {
        id: 'msg8',
        senderId: 'u4',
        text: 'Great, I can meet you at 10am Saturday!',
        createdAt: '2024-05-13T18:00:00Z',
        read: false,
      },
    ],
    unreadCount: 1,
  },
];
