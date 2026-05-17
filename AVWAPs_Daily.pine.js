//@version=6
indicator('AVWAPS - Daily Anchored VWAPs', shorttitle = 'AVWAPS Daily', overlay = true, max_bars_back = 5000)

// (((((((((((((((((((((((((( Daily AVWAP Inputs ))))))))))))))))))))))))))

avwap_group = "========== DAILY AVWAPS =========="
avwap_source = input.source(hlc3, "Source", group = avwap_group)
avwap_width = input.int(1, "Line Width", minval = 1, maxval = 5, group = avwap_group)
show_avwaps = input.bool(true, "Show AVWAPs", group = avwap_group)
show_labels = input.bool(false, "Show Day Labels", group = avwap_group)
show_anchor_markers = input.bool(true, "Show Anchor Markers", group = avwap_group)

mon_col = input.color(color.new(#6b3e2e, 0), "Monday",    group = avwap_group)
tue_col = input.color(color.new(#6b3e2e, 0), "Tuesday",   group = avwap_group)
wed_col = input.color(color.new(#6b3e2e, 0), "Wednesday", group = avwap_group)
thu_col = input.color(color.new(#6b3e2e, 0), "Thursday",  group = avwap_group)
fri_col = input.color(color.new(#6b3e2e, 0), "Friday",    group = avwap_group)

// (((((((((((((((((((((((((( Session Detection ))))))))))))))))))))))))))

daily_time = request.security(syminfo.tickerid, "D", time, lookahead = barmerge.lookahead_on)
new_day    = ta.change(daily_time) != 0

// Detecta se é mercado Forex/24h (abre domingo) ou tradicional (abre segunda)
var bool is_forex = false
if new_day and dayofweek(time_close, syminfo.timezone) == 1
    is_forex := true
if new_day and dayofweek(time_close, syminfo.timezone) == 2 and not is_forex
    is_forex := false

isFirstBarOfDay(dow_forex, dow_traditional) =>
    dow = is_forex ? dow_forex : dow_traditional
    new_day and dayofweek(time_close, syminfo.timezone) == dow

// (((((((((((((((((((((((((( Current Week ))))))))))))))))))))))))))

ms_in_day = 24 * 60 * 60 * 1000

getWeekStartTime(int source_time) =>
    source_dow = dayofweek(source_time, syminfo.timezone)
    days_to_week_start = is_forex ? source_dow - 1 : source_dow == 1 ? 6 : source_dow - 2
    week_start_time = source_time - days_to_week_start * ms_in_day
    timestamp(year(week_start_time, syminfo.timezone), month(week_start_time, syminfo.timezone), dayofmonth(week_start_time, syminfo.timezone), 0, 0)

isCurrentWeek() =>
    week_start_day = getWeekStartTime(last_bar_time)
    time_close >= week_start_day and time_close < week_start_day + 7 * ms_in_day

in_week = isCurrentWeek()
bar_weight = na(volume) or volume <= 0 ? 1.0 : volume

// (((((((((((((((((((((((((( Accumulators ))))))))))))))))))))))))))

var float mon_pv = 0.0
var float mon_v  = 0.0
var float tue_pv = 0.0
var float tue_v  = 0.0
var float wed_pv = 0.0
var float wed_v  = 0.0
var float thu_pv = 0.0
var float thu_v  = 0.0
var float fri_pv = 0.0
var float fri_v  = 0.0

var bool mon_started = false
var bool tue_started = false
var bool wed_started = false
var bool thu_started = false
var bool fri_started = false

// Monday: forex=1(dom), traditional=2(seg)
if isFirstBarOfDay(1, 2)
    mon_pv      := avwap_source * bar_weight
    mon_v       := bar_weight
    mon_started := true
else if in_week and mon_started
    mon_pv := mon_pv + avwap_source * bar_weight
    mon_v  := mon_v  + bar_weight

// Tuesday: forex=2(seg), traditional=3(ter)
if isFirstBarOfDay(2, 3)
    tue_pv      := avwap_source * bar_weight
    tue_v       := bar_weight
    tue_started := true
else if in_week and tue_started
    tue_pv := tue_pv + avwap_source * bar_weight
    tue_v  := tue_v  + bar_weight

// Wednesday: forex=3(ter), traditional=4(qua)
if isFirstBarOfDay(3, 4)
    wed_pv      := avwap_source * bar_weight
    wed_v       := bar_weight
    wed_started := true
else if in_week and wed_started
    wed_pv := wed_pv + avwap_source * bar_weight
    wed_v  := wed_v  + bar_weight

// Thursday: forex=4(qua), traditional=5(qui)
if isFirstBarOfDay(4, 5)
    thu_pv      := avwap_source * bar_weight
    thu_v       := bar_weight
    thu_started := true
else if in_week and thu_started
    thu_pv := thu_pv + avwap_source * bar_weight
    thu_v  := thu_v  + bar_weight

// Friday: forex=5(qui), traditional=6(sex)
if isFirstBarOfDay(5, 6)
    fri_pv      := avwap_source * bar_weight
    fri_v       := bar_weight
    fri_started := true
else if in_week and fri_started
    fri_pv := fri_pv + avwap_source * bar_weight
    fri_v  := fri_v  + bar_weight

// Reset flags fora da semana vigente
if not in_week
    mon_started := false
    tue_started := false
    wed_started := false
    thu_started := false
    fri_started := false

// (((((((((((((((((((((((((( AVWAP Values ))))))))))))))))))))))))))

mon_avwap = in_week and mon_started and mon_v > 0 ? mon_pv / mon_v : na
tue_avwap = in_week and tue_started and tue_v > 0 ? tue_pv / tue_v : na
wed_avwap = in_week and wed_started and wed_v > 0 ? wed_pv / wed_v : na
thu_avwap = in_week and thu_started and thu_v > 0 ? thu_pv / thu_v : na
fri_avwap = in_week and fri_started and fri_v > 0 ? fri_pv / fri_v : na

mon_anchor = isFirstBarOfDay(1, 2)
tue_anchor = isFirstBarOfDay(2, 3)
wed_anchor = isFirstBarOfDay(3, 4)
thu_anchor = isFirstBarOfDay(4, 5)
fri_anchor = isFirstBarOfDay(5, 6)

// (((((((((((((((((((((((((( Plots ))))))))))))))))))))))))))

plot(show_avwaps ? mon_avwap : na, title = "Monday AVWAP",    color = mon_col, linewidth = avwap_width)
plot(show_avwaps ? tue_avwap : na, title = "Tuesday AVWAP",   color = tue_col, linewidth = avwap_width)
plot(show_avwaps ? wed_avwap : na, title = "Wednesday AVWAP", color = wed_col, linewidth = avwap_width)
plot(show_avwaps ? thu_avwap : na, title = "Thursday AVWAP",  color = thu_col, linewidth = avwap_width)
plot(show_avwaps ? fri_avwap : na, title = "Friday AVWAP",    color = fri_col, linewidth = avwap_width)

plot(show_anchor_markers and mon_anchor ? mon_avwap : na, title = "Monday Anchor",    color = mon_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and tue_anchor ? tue_avwap : na, title = "Tuesday Anchor",   color = tue_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and wed_anchor ? wed_avwap : na, title = "Wednesday Anchor", color = wed_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and thu_anchor ? thu_avwap : na, title = "Thursday Anchor",  color = thu_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and fri_anchor ? fri_avwap : na, title = "Friday Anchor",    color = fri_col, style = plot.style_circles, linewidth = 4, editable = false)

// (((((((((((((((((((((((((( Labels ))))))))))))))))))))))))))

var label mon_label = na
var label tue_label = na
var label wed_label = na
var label thu_label = na
var label fri_label = na

updateLabel(label_id, label_text, label_value, label_color) =>
    if show_labels and barstate.islast and not na(label_value)
        if na(label_id)
            label.new(bar_index, label_value, label_text, style = label.style_label_left, textcolor = color.white, color = label_color, size = size.tiny)
        else
            label.set_xy(label_id, bar_index, label_value)
            label.set_text(label_id, label_text)
            label.set_color(label_id, label_color)
            label.set_textcolor(label_id, color.white)
            label_id
    else
        if not na(label_id)
            label.delete(label_id)
        na

mon_label := show_avwaps ? updateLabel(mon_label, "Mon", mon_avwap, mon_col) : na
tue_label := show_avwaps ? updateLabel(tue_label, "Tue", tue_avwap, tue_col) : na
wed_label := show_avwaps ? updateLabel(wed_label, "Wed", wed_avwap, wed_col) : na
thu_label := show_avwaps ? updateLabel(thu_label, "Thu", thu_avwap, thu_col) : na
fri_label := show_avwaps ? updateLabel(fri_label, "Fri", fri_avwap, fri_col) : na

