'use strict';

function repo_drawlogic(){
    canvas_setproperties({
      'properties': {
        'fillStyle': core_storage_data['color-positive'],
      },
    });
    canvas_buffer.fillRect(
      entity_entities['target']['x'],
      entity_entities['target']['y'],
      core_storage_data['target-width'],
      core_storage_data['target-height']
    );

    if(click_x >= 0){
        canvas_setproperties({
          'properties': {
            'fillStyle': core_storage_data['color-negative'],
          },
        });
        canvas_buffer.fillRect(
          click_x - 5,
          click_y - 5,
          10,
          10
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
      'info': '<input id=start type=button value="Start New Game">',
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
        'target-height': 100,
        'target-width': 100,
      },
      'storage-menu': '<table><tr><td><input id=target-height><td>Target Height'
        + '<tr><td><input id=target-width><td>Target Width</table>',
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
