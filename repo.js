'use strict';

function gameover(){
    running = false;
    canvas.canvas.style.cursor = 'auto';
}

function load_data(id){
    canvas.canvas.style.cursor = 'none';
    click_x = -1;
    click_y = -1;
    score = 0;

    randomize_shapes();
    running = true;
}

function randomize_shapes(){
    entity_remove_all();

    entity_create({
      'id': 'target',
      'properties': {
        'x': core_random_integer({
          'max': canvas_properties['width'] - core_storage_data['target-width'],
        }),
        'y': core_random_integer({
          'max': canvas_properties['height'] - core_storage_data['target-height'],
        }),
      },
    });
}

function repo_drawlogic(){
    if(!entity_entities['target']){
        return;
    }

    canvas_setproperties({
      'properties': {
        'fillStyle': '#206620',
      },
    });
    canvas.fillRect(
      entity_entities['target']['x'],
      entity_entities['target']['y'],
      core_storage_data['target-width'],
      core_storage_data['target-height']
    );

    if(click_x >= 0){
        canvas_setproperties({
          'properties': {
            'fillStyle': '#663366',
          },
        });
        canvas.fillRect(
          click_x - core_storage_data['click-width'] / 2,
          click_y - core_storage_data['click-height'] / 2,
          core_storage_data['click-width'],
          core_storage_data['click-height']
        );
        canvas_setproperties({
          'properties': {
            'fillStyle': '#000',
          },
        });
        canvas.fillRect(
          click_x - 3,
          click_y - 3,
          6,
          6
        );
    }
}

function repo_logic(){
    core_ui_update({
      'ids': {
        'score': score,
      },
    });
}

function repo_escape(){
    if(!core_menu_open){
        core_repo_reset();

    }else if(running){
        gameover();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'click_x': -1,
        'click_y': -1,
        'running': false,
        'score': 0,
      },
      'info': '<button id=start type=button>Start New Game</button>',
      'menu': true,
      'mousebinds': {
        'mousedown': {
          'todo': function(event){
              if(!running){
                  return;
              }

              click_x = core_mouse['down-x'];
              click_y = core_mouse['down-y'];

              if(click_x <= entity_entities['target']['x']
                || click_x >= entity_entities['target']['x'] + core_storage_data['target-width']
                || click_y <= entity_entities['target']['y']
                || click_y >= entity_entities['target']['y'] + core_storage_data['target-height']){
                  gameover();
                  return;
              }

              audio_start({
                'id': 'boop',
              });
              score += 1;
              randomize_shapes();
          },
        },
      },
      'reset': canvas_setmode,
      'storage': {
        'click-height': 36,
        'click-width': 36,
        'target-height': 100,
        'target-width': 100,
      },
      'storage-menu': '<table><tr><td><input class=mini id=click-height min=8 step=any type=number><td>Click Height'
        + '<tr><td><input class=mini id=click-width min=8 step=any type=number><td>Click Width'
        + '<tr><td><input class=mini id=target-height min=1 step=any type=number><td>Target Height'
        + '<tr><td><input class=mini id=target-width min=1 step=any type=number><td>Target Width</table>',
      'title': 'BlindMouse.htm',
      'ui': 'Score: <span id=score></span>',
    });
    audio_create({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
    });
    canvas_init();

    document.body.onmouseleave = gameover;
}
