'use strict';

function gameover(){
    running = false;
    core_elements['canvas'].style.cursor = 'pointer';
}

function load_data(id){
    core_elements['canvas'].style.cursor = 'none';
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
