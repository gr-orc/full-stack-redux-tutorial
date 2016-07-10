import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {
  describe('a number', () => {
    function incremet(currentState) {
      return currentState + 1;
    }

    it('is immutable', () => {
      let state = 42;
      let nextState = incremet(state);

      expect(nextState).to.equal(43);
      expect(state).to.equal(42);
    })
  });

  describe('a list', () => {
    function addMovie(currentState, movie) {
      // Array.prototype.push と違うのね？
      return currentState.push(movie);
    }

    it('is immutable', () => {
      let state = List.of('Trainspottig', '28 Days Later');
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(List.of(
        'Trainspottig',
        '28 Days Later',
        'Sunshine'
      ));

      expect(state).to.equal(List.of(
        'Trainspottig',
        '28 Days Later'
      ));
    })
  })

  describe('a tree', () => {
    function addMovie(currentState, movie) {
      // return currentState.set(
      //   'movies',
      //   currentState.get('movies').push(movie)
      // );
      return currentState.update('movies', movies => movies.push(movie));
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspottig', '28 Days Later')
      });
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(Map({
        movies: List.of(
          'Trainspottig',
          '28 Days Later',
          'Sunshine'
        )
      }));
      expect(state).to.equal(Map({
        movies: List.of(
          'Trainspottig',
          '28 Days Later'
        )
      }));
    });
  });
});
