var fs = require('fs');
fs.exists = fs.exists || require('path').exists;
var rimraf = require('rimraf');
var _ = require('underscore');
var git = require('./git');
var db = require('./db');

var base_dir = git.base_dir;

var path = function(id) {
  return base_dir + id;
}
var gitdir_exists = function(id, callback) {
  fs.exists(path(id), callback);
};

var updatefile = function(id, rep, lastrep, callback) {
  gitdir_exists(id, function(exists) {
    if (exists) {
      if (lastrep && rep != lastrep) {
        rimraf(path(id), function() {
          db.updateLastRep(id, rep, function() {
            git.gitclone(rep, id, callback);
          });
        });
      } else {
        git.gitpull(id, callback);
      }
    } else {
      git.gitclone(rep, id, callback);
      db.updateLastRep(id);
    }
  });
}



var process_domain = function(id, callback) {
  fs.readdir(path(id), function(err, files) {
    var domains = _.filter(files, function(f) {
      return f.charAt(0) !== ".";
    });
    callback(null, domains);
  })
}

var get_records = function(id, domain_name, callback) {
  var filename = path(id) + "/" + domain_name;
  var records = fs.readFile(filename, 'utf8', function(err, data) {
    if (!err) {
      var records = data.split("\n"); 
      records = _.filter(records, function(r) {
        return r.trim();
      });
      callback(null, records);
    } else {
      callback(err);
    } 
  } );
}

var analyse = function(line) {
  line = line.toUpperCase().replace(/['"]/g, '');
  var p_start = line.indexOf("(");
  var p_end = line.indexOf(")");
  var type = line.slice(0, p_start);
  var infos = line.slice(p_start + 1, p_end).split(',');
  infos = _.map(infos, function(i) {
    return i.trim();
  });
  return [type, infos] 
}

var gen_record = function(type, infos) {
  var record = {};
  var model = ['sub_domain', 'value', 'record_line', 'ttl', 'mx'];
  record.record_type = type;

  _.each(model, function(m, i) {
    infos[i] && (record[m] = infos[i]);
  });
  return record;

}


// exports
exports.updatefile = updatefile;
exports.process_domain = process_domain;
exports.get_records = get_records;
exports.analyse = analyse;
exports.gen_record = gen_record;





//test 

//process_domain(123);

//process_record(123, 'dnsgit.com.lua');

//var lua = 'a("mail", "1.2.3.4 ", "默认" , "120")';
//var ar = analyse(lua);
//var record = gen_record.apply(this, ar);
//console.log(ar);
//console.log(record);

//gitdir_exists(123, function() {
//  console.log('has callback');
//});

