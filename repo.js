'use strict';

function gameover(){
    canvas.canvas.style.cursor = 'auto';
}

function load_data(id){
    canvas.canvas.style.cursor = 'none';
    click_x = -1;
    click_y = -1;
    score = 0;

    randomize_shapes();
}

function randomize_shapes(){
    entity_remove_all();

    entity_create({
      'id': 'target',
      'properties': {
        'x': core_random_integer(canvas_properties.width - core_storage_data.target_width),
        'y': core_random_integer(canvas_properties.height - core_storage_data.target_height),
      },
    });

    core_ui_update({
      'ids': {
        'score': score,
      },
    });
    canvas_draw();
}

function repo_drawlogic(){
    if(core_menu_open){
        return;
    }

    canvas_setproperties({
      'fillStyle': '#206620',
    });
    canvas.fillRect(
      entity_entities.target.x,
      entity_entities.target.y,
      core_storage_data.target_width,
      core_storage_data.target_height
    );

    if(click_x === -1){
        return;
    }

    canvas_setproperties({
      'fillStyle': '#663366',
    });
    canvas.fillRect(
      click_x - core_storage_data.click_width / 2,
      click_y - core_storage_data.click_height / 2,
      core_storage_data.click_width,
      core_storage_data.click_height
    );
    canvas_setproperties({
      'fillStyle': '#000',
    });
    canvas.fillRect(
      click_x - 3,
      click_y - 3,
      6,
      6
    );
}

function repo_escape(){
    if(!core_menu_open){
        canvas_setmode();

    }else if(canvas !== 0){
        gameover();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
          'onclick': canvas_setmode,
        },
      },
      'globals': {
        'click_x': -1,
        'click_y': -1,
        'score': 0,
      },
      'info': '<button id=start type=button>Start New Game</button>',
      'menu': true,
      'pointerbinds': {
        'pointerdown': {
          'todo': function(){
              if(canvas.canvas.style.cursor === 'auto'){
                  return;
              }

              click_x = core_pointer.down_x;
              click_y = core_pointer.down_y;

              if(click_x <= entity_entities.target.x
                || click_x >= entity_entities.target.x + core_storage_data.target_width
                || click_y <= entity_entities.target.y
                || click_y >= entity_entities.target.y + core_storage_data.target_height){
                  gameover();
                  canvas_draw();

              }else{
                  audio_start('boop');
                  score += 1;
                  randomize_shapes();
              }
          },
        },
        'pointermove': {
          'todo': function(){
              if(canvas.canvas.style.cursor === 'auto'){
                  return;
              }

              if(core_pointer.x <= 1 || core_pointer.x >= globalThis.innerWidth - 1
                || core_pointer.y <= 1 || core_pointer.y >= globalThis.innerHeight - 1){
                  gameover();
              }
          },
        },
      },
      'storage': {
        'click_height': 36,
        'click_width': 36,
        'target_height': 100,
        'target_width': 100,
      },
      'storage_menu': '<table><tr><td><input class=mini id=click_height min=8 step=any type=number><td>Click Height'
        + '<tr><td><input class=mini id=click_width min=8 step=any type=number><td>Click Width'
        + '<tr><td><input class=mini id=target_height min=1 step=any type=number><td>Target Height'
        + '<tr><td><input class=mini id=target_width min=1 step=any type=number><td>Target Width</table>',
      'title': 'BlindMouse.htm',
      'ui': 'Score: <span id=score></span>',
    });
    canvas_init({
      'interval': false,
    });

    document.body.onpointerleave = gameover;
}
