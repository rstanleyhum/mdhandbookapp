'use strict';

import { SQLite } from 'expo';


const CREATE_PAGES_TABLE_SQL = `CREATE TABLE IF NOT EXISTS pagestable (
    id TEXT,
    json_str TEXT);
`;

const INSERT_PAGE_SQL = `INSERT INTO pagestable (json_str) VALUES (?);`;

const SELECT_ALL_PAGES_SQL = `SELECT * FROM pagestable;`;


const CREATE_CSS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS csstable (
    id TEXT,
    json_str TEXT);
`;

const SELECT_ALL_CSS_SQL = `SELECT * FROM csstable;`;

const INSERT_CSS_SQL = `INSERT INTO csstable (json_str) VALUES (?);`;


const db = SQLite.openDatabase({name: 'pages.db3'});



export const SetupLocalDB = () => {
    var p = new Promise( (resolve, reject) => {
            db.transaction(
            tx => {
                tx.executeSql(CREATE_PAGES_TABLE_SQL, [], () => {}, () => {console.log("ERROR: (SetupLocalDB - CREATE_PAGES_TABLE_SQL):")} );
                tx.executeSql(CREATE_CSS_TABLE_SQL, [], () => {}, () => {console.log("ERROR: (SetupLocalDB - CREATE_CSS_TABLE_SQL):")} );
            },
            (err) => {
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );
    });
    return p;
};


export const SaveAll = (pages, css) => {
    var p = new Promise( (resolve, reject) => {
        var json_str = JSON.stringify(pages);
        InsertPage(json_str)
        .then( success => {
            json_str = JSON.stringify(css);
            return InsertCss(json_str);
        })
        .then( success => {
            resolve(success);
        })
        .catch( error => {
            resolve(false);
        })
    });
    return p;
};


export const InsertPage = (v) => {
    var p = new Promise( (resolve, reject) => {
        let args = [
            v,
        ];
        db.transaction(
            tx => {
                tx.executeSql(INSERT_PAGE_SQL, args, () => {
                    resolve(true);
                },
                (tx, err) => {
                    console.log("ERROR: (InsertPage - ExecuteSQL):", err);
                    resolve(false);
                })
            },
            (err) => {
                console.log("ERROR: (InsertPage - Transaction):", err);
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );

    });
    return p;
};


export const InsertCss = (v) => {
    var p = new Promise( (resolve, reject) => {
        let args = [
            v,
        ];
        db.transaction(
            tx => {
                tx.executeSql(INSERT_CSS_SQL, args, () => {
                    resolve(true);
                },
                (tx, err) => {
                    console.log("ERROR: (InsertCss - ExecuteSQL):", err);
                    resolve(false);
                })
            },
            (err) => {
                console.log("ERROR: (InsertCss - Transaction):", err);
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );

    });
    return p;
};


export const GetAllCss = () => {
    var p = new Promise( (resolve, reject) => {
        var css = {};
        db.transaction(
            tx => {
                tx.executeSql(SELECT_ALL_CSS_SQL, [], (tx, rs) => {
                    if (rs.rows.length != 0) {
                        css = rs.rows._array[0].json_str;
                    } else {
                        css = null;
                    }
                },
                (tx, err) => {
                    console.log("ERROR (GetAllQuestions): ExecuteSQL:", err);
                })
            },
            (err) => {
                console.log("ERROR (GetAllQuestions): Transaction:", err);
                reject(null);
            },
            () => {
                resolve(css);
            }
        );
    });
    return p;
};

export const GetAllPages = () => {
    var p = new Promise( (resolve, reject) => {
        var pages = {};
        db.transaction(
            tx => {
                tx.executeSql(SELECT_ALL_PAGES_SQL, [], (tx, rs) => {
                    if (rs.rows.length != 0) {
                        pages = rs.rows._array[0].json_str;
                    } else {
                        pages = null
                    }
                },
                (tx, err) => {
                    console.log("ERROR (GetAllQuestions): ExecuteSQL:", err);
                })
            },
            (err) => {
                console.log("ERROR (GetAllQuestions): Transaction:", err);
                reject(null);
            },
            () => {
                resolve(pages);
            }
        );
    });
    return p;
};