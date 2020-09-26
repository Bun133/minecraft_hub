const builder = require('electron-builder');

builder.build(
    {
        config:{
            'appId' : 'com.bun133.minecraft_launcher',
            'win':{
                'target': {
                    'target': 'zip',
                    'arch': [
                        'x64',
                        'ia32',
                    ]
                }
            }
        }
    }
)