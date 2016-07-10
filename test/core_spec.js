import {expect} from 'chai';
import {List, Map} from 'immutable';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspottig', '28 Days Later');
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Trainspottig', '28 Days Later')
      }));
    });
  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspottig', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }));
    });

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later'),
          tally: Map({
            'Trainspottig': 4,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
        }),
        entries: List.of('127 Hours', 'Trainspottig')
      }));
    });

    it('puts both from tied vote bakc to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later'),
          tally: Map({
            'Trainspottig': 3,
            '28 Days Later': 3,
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
        }),
        entries: List.of('127 Hours', 'Trainspottig', '28 Days Later')
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later'),
          tally: Map({
            'Trainspottig': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        winner: 'Trainspottig',
      }));
    });
  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later')
        }),
        entries: List()
      });
      const nextState = vote(state, 'Trainspottig');

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later'),
          tally: Map({
            'Trainspottig': 1,
          })
        }),
        entries: List()
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later'),
          tally: Map({
            'Trainspottig': 3,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });
      const nextState = vote(state, 'Trainspottig');

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspottig', '28 Days Later'),
          tally: Map({
            'Trainspottig': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      }));
    });

  });

});
