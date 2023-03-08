export class CharactersVaultMessageHandler {
  constructor(
    private readonly sendMessage: (message: {
      type: string;
      data: any;
    }) => void,
  ) {}

  handle(type: string, data: any) {
    const actors = [...game.actors];

    if (type === 'get-actors') {
      const actorsData = actors.map((a) => ({
        id: a.id,
        name: a.name,
        vtt: 'foundry',
        data: a.data.data,
      }));

      this.sendMessage({
        type: 'actors',
        data: {
          vtt: 'foundry',
          system: 'AnimaBeyondFantasy',
          actors: actorsData,
        },
      });
    }

    if (type === 'update-actor') {
      const newActor = data.actor;
      const actions = data.actions;

      const actor = actors.find((a) => a.id === newActor.id);

      if (actor) {
        actor.update({
          name: newActor.name,

          data: newActor.data,
        });

        for (const action of actions) {
          if (action.type === 'delete' && action.ids.length > 0) {
            actor.deleteEmbeddedDocuments('Item', action.ids);
          }

          if (action.type === 'create' && action.data.length > 0) {
            actor.createEmbeddedDocuments(
              'Item',
              action.data.map((d: any) => ({
                type: d.type,
                name: d.name,
                data: d.data,
              })),
            );
          }
        }
      }
    }
  }
}
