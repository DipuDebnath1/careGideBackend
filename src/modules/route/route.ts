import express from 'express';
import AuthRoute from '../auth/auth.route';
import UserRoute from '../user/user.route';
import NoteRoute from '../notes/note.route';
import PostRoute from '../posts/post.route';

const router = express.Router();

const moduleRoute = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/notes',
    route: NoteRoute,
  },
  {
    path: '/posts',
    route: PostRoute,
  },
];

moduleRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
