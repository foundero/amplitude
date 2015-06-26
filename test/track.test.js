let nock = require('nock');
import Amplitude from '../lib/amplitude';

describe('track', () => {

  let amplitude = new Amplitude('token', { user_id: 'unique_user_id'});

  let data = {
    event_type: 'event'
  };
  let api_url = 'https://api.amplitude.com';
  let stringified_url = '/httpapi?api_key=token&event=%7B%22event_type%22%3A%22event%22%2C%22user_id%22%3A%22unique_user_id%22%7D';

  beforeEach(() => {
    sandbox.stub(console, 'error');
  });

  context('succesful call', () => {

    beforeEach(() => {
      nock(api_url).post(stringified_url)
       .reply(200);
    });

    it('does not log error', (done) => {

      amplitude.track(data, () => {
        expect(console.error).to.not.be.called;
        done();
      });
    });
  });

  context('unsucesful call', () => {

    it('logs error', (done) => {
      nock(api_url).post(stringified_url)
       .replyWithError('not succesful');

      amplitude.track(data, () => {
        expect(console.error).to.be.calledOnce;
        expect(console.error).to.be.calledWith('There was a problem tracking "event" for "unique_user_id"; Error: not succesful');
        done();
      });
    });
  });
});
