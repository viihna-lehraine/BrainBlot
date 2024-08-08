import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { getSecrets, modelPromises, setupLogger } from '../index.js';

const { UserModelPromise } = modelPromises;

export default async function configurePassport(passport) {
  const secrets = await getSecrets();
  const logger = await setupLogger();
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secrets.JWT_SECRET;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await UserModelPromise.findByPk(jwt_payload.id);
        if (user) {
          logger.info(
            'JWT authentication successful for user ID: ',
            jwt_payload.id,
          );
          return done(null, user);
        } else {
          logger.warn(
            'JWT authentication failed for user ID: ',
            jwt_payload.id,
          );
          return done(null, false);
        }
      } catch (err) {
        logger.error('JWT authentication error: ', err);
        return done(err, false);
      }
    }),
  );

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await UserModelPromise.findOne({ where: { username } });
        if (!user) {
          logger.warn(
            'Local authentication failed: User not found: ',
            username,
          );
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          logger.info('Local authentication successful for user: ', username);
          return done(null, user);
        } else {
          logger.warn(
            'Local authentication failed: incorrect password for user: ',
            username,
          );
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        logger.error(
          'Local authenticaton error for user: ',
          username,
          ' : Error: ',
          err,
        );
        return done(err);
      }
    }),
  );
}
