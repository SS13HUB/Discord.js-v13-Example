

if ((require.main == null) || (!require.main.filename.endsWith('\\index.js'))) {
    throw `"${__filename}":\nThis file must be imported from index file.`;
}

//const process = require('process');
const fs = require('fs');


/* const index = require(process.cwd() + '\\index');
const client = index.client;

const base_path = client.g.cwd() + '\\data\\database\\Guilds\\';
const db_guilds_create = base_path + 'create.sql';
const db_guilds_drop   = base_path + 'drop.sql';
const db_guilds_insert = base_path + 'insert.sql';
const db_guilds_select = base_path + 'select.sql'; */

module.exports = {
    load: async (cwd) => {
        if (!cwd) throw 'No CWD for SQL module provided!'
        cwd += '\\data\\database\\';
        let filesDict = {
            'Meta': {
                '_isLoaded': false,
                '_errorOccured': false,
            },
            'Pathes': {
                'Guilds': {
                    'Create': cwd + 'Guilds\\' + 'create.sql',
                    'Drop':   cwd + 'Guilds\\' + 'drop.sql',
                    'Insert': cwd + 'Guilds\\' + 'insert.sql',
                    'Select': cwd + 'Guilds\\' + 'select.sql',
                },
                'Invites': {
                    'Create': cwd + 'Invites\\' + 'create.sql',
                    'Drop':   cwd + 'Invites\\' + 'drop.sql',
                    'Insert': cwd + 'Invites\\' + 'insert.sql',
                    'Select': cwd + 'Invites\\' + 'select.sql',
                },
            },
            'Data': {
                'Guilds': {
                    'Create': null,
                    'Drop':   null,
                    'Insert': null,
                    'Select': null,
                },
                'Invites': {
                    'Create': null,
                    'Drop':   null,
                    'Insert': null,
                    'Select': null,
                },
            }
        };
        if (!filesDict.Meta._isLoaded) {
            console.log('Loading SQL files...');
            console.log('Object.keys(filesDict.Pathes).length', Object.keys(filesDict.Pathes).length);
            for (var path_category in filesDict.Pathes) {
                console.log('path_category:', path_category);
                for (var file_path in filesDict.Pathes[path_category]) {
                    const path = filesDict.Pathes[path_category][file_path];
                    //console.log('path:', path);
                    fs.readFile(path, 'utf8', (error, data) => {
                        if (error) {
                            filesDict.Meta._errorOccured = true
                            throw error;
                        }
                        //console.log(data.toString());
                        return filesDict.Data[path_category][file_path] = data.toString();
                        //console.log('data.toString():', data.toString());
                        //console.log('filesDict.Data[path_category][file_path]:', filesDict.Data[path_category][file_path]);
                    });
                }
            }
            filesDict.Meta._isLoaded = true;
            console.log('filesDict.Data:\n', filesDict.Data);
        }
        console.log('filesDict.Data:\n', filesDict.Data);
        return false;
    },
}
