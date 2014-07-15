
//////////////////////////////////////////////////
// ユーティリティ
if (!window.console) {
  console = {log: function() {} };
}
// Element作成
function E(tag,attrs,children) {
    var elm = document.createElement(tag);
    for(var i in attrs) {
        if ("id className textContent".indexOf(i) >= 0) {
            elm[i] = attrs[i];
        } else {
            elm.setAttribute(i,attrs[i]);
        }
    }
    if (children) {
        for(var i=0;i<children.length;i++) {
            elm.appendChild(children[i]);
        }
    }
    return elm;
}
function DIV(attrs,children) {
    return E("div",attrs,children);
}
function T(content) {
    return document.createTextNode(content);
}
Date.prototype.isSameDate = function(a) {
    return (this.getFullYear() == a.getFullYear() &&
            this.getMonth() == a.getMonth() &&
            this.getDate() == a.getDate());
};
Date.prototype.isSameMonth = function(a) {
    return (this.getFullYear() == a.getFullYear() &&
            this.getMonth() == a.getMonth());
};
Function.prototype.bind = function(that) {
    var f = this;
    return function() {
        return f.apply(that,arguments);
    };
};

//////////////////////////////////////////////////
// モデル定義

function Schedule(id,datetime,title,memo) {
    this.id = id;
    this.datetime = datetime;
    this.title = title;
    this.memo = memo;
}
Schedule.createByDate = function(date) {
    var d = new Date(date.getTime()+(12*3600*1000));
    return new Schedule(null,d,"","");
};
Schedule.prototype = {
    getTitle: function() {return this.title;},
    getMemo: function() {return this.memo;},
    d2: function(num) {
        var a = '00'+num;
        return a.substring(a.length-2,a.length);
    },
    getScheduleText: function() {
        return this.getTimeText()+' '+this.title;
    },
    getTimeText: function() {
        var hh = this.d2(this.datetime.getHours());
        var mm = this.d2(this.datetime.getMinutes());
        return hh+':'+mm;
    },
    getDateText: function() {
        var year = this.datetime.getFullYear();
        var mm = this.datetime.getMonth()+1;
        var dd = this.datetime.getDate();
        return year+'年'+mm+'月'+dd+'日';
    },
    setDatetime: function(text) {
        var cols = text.split(':');
        if (cols.length != 2) {
            //validation error
        } else {
            var p = this.datetime;
            this.datetime.setHours(parseInt(cols[0],10));
            this.datetime.setMinutes(parseInt(cols[1],10));
        }
    },
    setTitle: function(text) {
        this.title = text;
    },
    setMemo: function(text) {
        this.memo = text;
    }
};

var DAYS = '日 月 火 水 木 金 土'.split(' ');

var model = new function() {
    var model = this;
    
    this.calendarModel = {
        list: [],
        getAllSchedules: function() { return this.list; },
        getSchedulesByDate: function(date) {
            var ret = [];
            $.each(this.list,function(i,schedule) {
                       if (schedule.datetime.isSameDate(date)) {
                           ret.push(schedule);
                       }
                   });
            ret.sort(function(a,b) {
                         return a.datetime.getTime() - b.datetime.getTime();
                     });
            return ret;
        },
        
        addSchedule: function(schedule) {
            this.list.push(schedule);
            model.updateView();
        }
    };

    this.regionModel = {
        startDate: null,
        dateCount: 0,
        displayType: 'month',
        
        getDisplayType: function() {return this.displayType;},
        
        //論理的開始、終了
        getStartDate: function() {return this.startDate;},
        getEndDate: function() {
            return new Date(this.startDate.getTime() + this.dateCount*24*3600*1000);
        },
        
        //物理的開始、終了
        getRegionStartDate: function() {
            return new Date(this.getStartDate().getTime() - 
                            this.getStartDate().getDay()*24*3600*1000);
        },
        getRegionEndDate: function() {
            return new Date(this.getEndDate().getTime() + 
                            (7-this.getEndDate().getDay())*24*3600*1000);
        },

        getDateCount: function() {return this.dateCount;},
        
        setStartDate: function(date) {
            this.startDate = date;
            if (this.displayType == 'month') {
                var next = new Date(date.getFullYear(),date.getMonth()+1);
                this.dateCount = Math.floor((next.getTime()-date.getTime())/(24*3600*1000));
            } else {
                this.dateCount = 7;
                //weekの場合は変わらない
            }
        },

        //ここのmonthは1から始まる月
        changeByMonth: function(year,month) {
            this.setStartDate(new Date(year,month-1,1));
            var nextDate = new Date(year,month);
            model.updateRegion();
        },
        changeByToday: function() {
            var today = new Date();
            if (this.displayType == 'month') {
                this.changeByMonth(today.getFullYear(),today.getMonth()+1);
            } else {
                //todo
            }
        },
        moveNext: function() {
            var today = this.startDate;
            if (this.displayType == 'month') {
                this.changeByMonth(today.getFullYear(),today.getMonth()+2);
            } else {
                //todo
            }
        },
        movePrevious: function() {
            var today = this.startDate;
            if (this.displayType == 'month') {
                this.changeByMonth(today.getFullYear(),today.getMonth());
            } else {
                //todo
            }
        },

        getCalendarTable: function() {
            if (this.displayType == 'month') {
                var year = this.startDate.getFullYear();
                var month = this.startDate.getMonth();
                var mday = this.startDate.getDay();
                //カレンダーの左上の日付
                var currentDate = new Date(year,month,1-mday);
                //翌月の初めの日この日以降になったら終わり
                var nextMonth = new Date(year,month+1,1);
                
                var weeks = [];
                while(true) {
                    if (currentDate.getTime() >= nextMonth.getTime()) break;
                    var aweek = [];
                    for(var i=0;i<7;i++) {
                        aweek.push(currentDate);
                        currentDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+1);
                    }
                    weeks.push(aweek);
                }
                return weeks;
            } else {
                //todo
            }
        }
        
    };
    
    //範囲が変わって内容を更新する
    this.updateRegion = function() {
    	var self = this;
        var rm = model.regionModel;
        CalenderAPI.list(rm.getRegionStartDate(),rm.getRegionEndDate(),
                         function(list) {
                             model.calendarModel.list = list;
                             model.updateView();
                         });
    };
    
    //範囲が変わらずに内容を更新する
    this.updateView = function() {
        view.updateHeader();
        view.updateMain();
    };

    this.init = function() {
        this.regionModel.changeByToday();
    };
};

//////////////////////////////////////////////////
// ビュー定義

var view = {
    
    //////////////////////////////////////////////////
    // ビュー初期化
    
    init: function() {
        $('#header-btn-previous')
            .click(function() {
                       model.regionModel.movePrevious();
                   });
        $('#header-btn-next')
            .click(function() {
                       model.regionModel.moveNext();
                   });
        $('#header-btn-today')
            .click(function() {
                       model.regionModel.changeByToday();
                   });
        $("#schedule-dialog").dialog().dialog('close');
    },
    
    //////////////////////////////////////////////////
    // ビュー更新
    
    updateHeader: function() { 
        var cdate = model.regionModel.getStartDate();
        $('#header-current-month')
            .text(cdate.getFullYear()+"年"+
                  (cdate.getMonth()+1)+"月");
        
        if (model.regionModel.getDisplayType() == 'month') {
            $('#header-btn-month').addClass('selected');
            $('#header-btn-week').removeClass('selected');
        } else {
            $('#header-btn-month').removeClass('selected');
            $('#header-btn-week').addClass('selected');
        }
    },
    
    updateMain: function() {
        if (model.regionModel.getDisplayType() == 'month') {
            this.updateMainByMonth();
        } else {
            this.updateMainByWeek();
        }
    },
    
    ////////////////////////////////////////////////////
    // 月表示の描画

    //１ヶ月の枠組みを作る
    updateMainByMonth: function() {
        var $main = $('#main');
        $main.empty();
        
        // header
        var theadElm = E('thead');
        var headerElm = 
            E('tr',{},
              $.map(DAYS,function(i,val) {
                        return E('th',{textContent:DAYS[val]});
                    }));
        theadElm.appendChild(headerElm);

        // body
        var that = this;
        var tbodyElm = E('tbody');
        var weeks = model.regionModel.getCalendarTable();
        $.each(weeks,
               function(i,aweek) {
                   var trElm = E('tr',{}, $.map(aweek,that.makeTdForMonth.bind(that)));
                   tbodyElm.appendChild(trElm);
               });
        
        // table
        var tableElm = E('table',{className:'month'},
                         [theadElm,tbodyElm]);
        $main.append( tableElm );
    },
    
    //１日の表示を作る
    makeTdForMonth: function(date) {
        var today = new Date();
        var tdElm = E('td',{className: (date.isSameDate(today) ? 'today' : '')});
        var thisMonth = model.regionModel.getStartDate();
        var dateElm = DIV({textContent:''+date.getDate(),
                           className: (date.isSameMonth(thisMonth) ? 'month-day' : 'other-month-day')
                          });
        var scheduleElm = DIV({className:'schedules'},
                              this.makeSchedulesForMonth(date));
        tdElm.appendChild(dateElm);
        tdElm.appendChild(scheduleElm);
        $(tdElm).click(function(event) {
                           scheduleController.onCreateSchedule(date);
                           event.stopPropagation();
                       });
        return tdElm;
    },
    
    //スケジュールの一覧のDIVを作る
    makeSchedulesForMonth: function(date) {
        var df = [];
        var list = model.calendarModel.getSchedulesByDate(date);
        $.each(list,function(i,schedule) {
                   var txtElm = 
                       DIV({className: 'schedule',
                            textContent: schedule.getScheduleText()});
                   $(txtElm)
                       .click(function(event) {
                                  scheduleController.onClickSchedule(schedule,txtElm);
                                  event.stopPropagation();
                              });
                   df.push(txtElm);
               });
        return df;
    },

    ////////////////////////////////////////////////////
    //週表示の描画
    
    updateMainByWeek: function() {
    }
    
};


//////////////////////////////////////////////////
// コントローラー定義

var scheduleController = {
    onClickSchedule: function(schedule,elm) {
        scheduleController
            .showDialog('スケジュールの修正',schedule,
                        scheduleController.dialog.onScheduleOk,
                        scheduleController.dialog.onScheduleDelete);
    },
    onCreateSchedule: function(date) {
        var s = Schedule.createByDate(date);
        scheduleController
            .showDialog('新しいスケジュール',s,
                       scheduleController.dialog.onScheduleOk);
    },
    
    showDialog: function(title,schedule,callback,deleteCallback) {
        $("#schedule-dialog input[name='datetime']").val(schedule.getTimeText());
        $("#schedule-dialog input[name='title']").val(schedule.getTitle());
        $("#schedule-dialog textarea[name='memo']").val(schedule.getMemo());
        $("#schedule-dialog button[class='btn-delete']")
            .css('display',(schedule.id ? 'inline' : 'none'))
            .click(function() {
                       $("#schedule-dialog").dialog('close');
                       if(deleteCallback) deleteCallback(schedule);
                   });
        $("#schedule-dialog")
            .dialog('option',{bgiframe: true,
                     modal: true,
                     title: schedule.getDateText()+' '+title,
                     width:600,
                     buttons: 
                     { "Ok": function() {
                           $(this).dialog("close").dialog('destory');
                           if (callback) callback(schedule);
                       },
                       "Cancel": function() {
                           $(this).dialog("close").dialog('destory');
                       }
                     }});
        $("#schedule-dialog").dialog('open');
    },
    
    dialog: {
        schedule: null,
        onScheduleOk: function(schedule) {
            schedule.setDatetime($("#schedule-dialog input[name='datetime']").val());
            schedule.setTitle($("#schedule-dialog input[name='title']").val());
            schedule.setMemo($("#schedule-dialog textarea[name='memo']").val());
            CalenderAPI
                .update(schedule,
                        function() {
                            model.updateRegion();
                        });
        },
        onScheduleDelete: function(schedule) {
            CalenderAPI
                .remove(schedule,
                        function() {
                            model.updateRegion();
                        });
        }
    }
};

//////////////////////////////////////////////////
// サーバーAPI

var CalenderAPI = {
    post: function(url, params, callback) {
      console.log('url:%s', url);
      $.getJSON(url, params, function(result) {
        if(result && result.status == 'error') {
          alert(result.errors.join('\n'));
        } else {
          callback(result);
        }
      });
    },
    list: function(from, to, callback) {
      var fmt = new DateFormat("yyyy/MM/dd");
      var params = {
        from: fmt.format(from),
        to: fmt.format(to)
      };
      this.post('events/list', params, function(json) {
        var schedules = [];
        $.each(json, function(i,it) {
        	
          var d = new Date(it.startDatetime);
          var year  = d.getFullYear();
          var month = d.getMonth() + 1;
          var day  = d.getDate();
          var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
          var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
          var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
          var dstr = year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;
          
          schedules.push(new Schedule(it.id, dstr, it.title, it.endDatetime));
        });
      	callback(schedules);
      });
    },
    update: function(schedule, callback) {
      var fmt = new DateFormat("yyyy/MM/dd HH:mm:ss");
      var params = {
        id: schedule.id,
        datetime: fmt.format(schedule.datetime),
        title: schedule.title,
        memo: schedule.memo
      };
      this.post('schedule/update', params, callback);
    },
    remove: function(schedule, callback) {
      var params = {
        id: schedule.id
      };
      this.post('schedule/remove' ,params,callback);
    },
};

//////////////////////////////////////////////////
// テスト

//簡単なテストチェック関数
function ok(title,expect,value) {
    if (expect !== value) {
        console.log("NG : "+title+" ["+expect+"] --> ["+value+"]");
    } else {
        console.log("OK : "+title);
    }
}

function prepareMock() {
    var list = [
        new Schedule(1, new Date('2009/10/11 13:00'), 'WEBDB記事', 'ヌーラボ社に集合。続きがんばる。'),
        new Schedule(2, new Date('2009/10/1 12:00'), 'スケジュール１', 'memo1'),
        new Schedule(3, new Date('2009/10/21 13:00'), 'しごと', 'memo2'),
        new Schedule(4, new Date('2009/10/31 13:00'), 'しごと２', 'memo3'),
        new Schedule(6, new Date('2009/10/21 10:00'), '前の仕事', 'memoメモ'),
        new Schedule(7, new Date('2009/10/21 18:00'), 'あとの仕事', 'memoメモ'),
        new Schedule(5, new Date('2009/11/6 13:00'), 'Emacs', 'memo4')
    ];
    model.calendarModel.list = list;
}

function test() {
    ok('全部',7,model.calendarModel.getAllSchedules().length);
    var sample = model.calendarModel.getSchedulesByDate(new Date('2009/10/21'));
    ok('日時指定',3,sample.length);
    ok('その日の順番',6,sample[0].id);
    
    model.regionModel.changeByMonth(2009,10);
    ok('日数 /10月',31,model.regionModel.getDateCount());
    model.regionModel.moveNext();
    ok('次の月',10, model.regionModel.getStartDate().getMonth());
    ok('日数 /11月',30,model.regionModel.getDateCount());
    model.regionModel.movePrevious();
    ok('日数 /10月',31,model.regionModel.getDateCount());
    ok('もとの月',9, model.regionModel.getStartDate().getMonth());
    model.regionModel.movePrevious();
    ok('日数 /9月',30,model.regionModel.getDateCount());
    ok('前の月',8,model.regionModel.getStartDate().getMonth());
    model.regionModel.changeByToday();
    ok('今月',new Date().getMonth(),model.regionModel.getStartDate().getMonth());
}

//////////////////////////////////////////////////
// 初期化実行

$(function() {
      //prepareMock();
      view.init();
      model.init();
      //test();
  });
