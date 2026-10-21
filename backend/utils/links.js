export const withGameLinks = (game) => ({
  ...game,
  _links: {
    self:   { href: `/games/${game.id}` },
    rounds: { href: `/games/${game.id}/rounds` },
  },
});

export const withRoundLinks = (round) => ({
  ...round,
  _links: {
    self:   { href: `/games/${round.game_id}/rounds/${round.id}` },
    game:   { href: `/games/${round.game_id}` },
    events: { href: `/games/${round.game_id}/rounds/${round.id}/events` },
  },
});

export const withEventLinks = (event, gameId) => ({
  ...event,
  _links: {
    self:  { href: `/games/${gameId}/rounds/${event.round_id}/events/${event.id}` },
    round: { href: `/games/${gameId}/rounds/${event.round_id}` },
  },
});