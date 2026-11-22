// The three teams. `key` is the value of the `team` field in the users collection.
export const TEAMS = [
  {
    key: 'montagne',
    image: require('../assets/images/team_terre.png'),
    button: 'rgba(36, 83, 19, 0.9)',
    background: '#885313',
  },
  {
    key: 'ocean',
    image: require('../assets/images/team_ocean.png'),
    button: 'rgba(43, 80, 170, 0.9)',
    background: '#2B50AA',
  },
  {
    key: 'soleil',
    image: require('../assets/images/team_soleil.png'),
    button: 'rgba(255, 159, 10, 0.9)',
    background: '#FF9F0A',
  },
];

export const teamByKey = (key) => TEAMS.find((team) => team.key === key);
