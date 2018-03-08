import { SSR } from 'meteor/meteorhacks:ssr';

SSR.compileTemplate(
  'invite',
  Assets.getText(
    'emails/invite.html'
  )
);

SSR.compileTemplate(
  'reset-password',
  Assets.getText(
    'emails/email-reset-password.html'
  )
);

SSR.compileTemplate(
  'verify-email',
  Assets.getText(
    'emails/email-verification.html'
  )
);

SSR.compileTemplate(
  'inviteToMaven',
  Assets.getText(
    'emails/refer-a-friend.html'
  )
);

SSR.compileTemplate(
  'inviteBoard',
  Assets.getText(
    'emails/send-a-board.html'
  )
);
SSR.compileTemplate(
  'inviteProduct',
  Assets.getText(
    'emails/send-a-product.html'
  )
);
