const getActorsWithOwnerPermission = () => {
  if (game.actors) {
    return game.actors.filter((a) => a.permission === 3);
  }

  return [];
};

const IAmAGM = game.user?.isGM === true;

export class MessageHandler {
  constructor(
    private readonly sendMessage: (message: {
      type: string;
      data: any;
    }) => void,
  ) {}

  async handle(type: string, data: any) {
    const actors = [...getActorsWithOwnerPermission()];

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

    if (IAmAGM) {
      if (type === 'new-actor') {
        const actor = await Actor.create({
          name: 'Dummy actor (Characters Vault)',
          type: 'character',
        });

        if (!actor) {
          console.error('Error creating actor');
          return;
        }

        this.sendMessage({
          type: 'new-actor',
          data: {
            id: actor.id,
            name: actor.name,
            vtt: 'foundry',
            data: actor.data.data,
          },
        });
      }
    }

    if (type === 'update-actor') {
      const newActor = data.actor;
      const actions = data.actions;

      const actor = actors.find((a) => a.id === newActor.id);

      if (actor) {
        this.updateActor(actor, newActor, actions);
      }
    }
  }

  private updateActor(actor: any, newActor: any, actions: any[]) {
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
