import {List, Map} from 'immutable';

export function setEntries(state, entries) {
  return state.set('entries', entries);
}
export function next(state) {
  const entries = state.get('entries');
  return state.merge({
    vote: Map({ pair: entries.take(2),}),
    entries: entries.skip(2)
  });
}

export function vote(state, entry) {
  // simillar to update-in in clojure
  return state.updateIn(
    ['vote', 'tally', entry], // path to nested key
    0,                        // defalut value if above key is not exsited
    tally => tally + 1        // update function
  );
}

// helper function to get winner(s)
function getWinners(vote) {
  if (!vote) {
    return [];
  }

  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);

  if (aVotes > bVotes) {
    return [a]
  } else if (aVotes < bVotes) {
    return [b];
  } else {
    return [a, b];
  }
}

export function next(state) {
  const entries = state.get('entries')
    .concat(getWinners(state.get('vote')));

  if (entries.size === 1) {
    // どう見ても return { winner: entries.first() } のほうが綺麗だけど、
    // この方法のほうが、将来他のキーを追加してもぶっ壊れないからいいという判断らしい
    return state
      .remove('vote')
      .remove('entries')
      .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({ pair: entries.take(2) }),
      entries: entries.skip(2)
    });
  }
}
