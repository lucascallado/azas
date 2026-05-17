//@version=6
indicator('AVWAPS - Monthly Anchored VWAPs', shorttitle = 'AVWAPS', overlay = true, max_bars_back = 5000)

// (((((((((((((((((((((((((( Monthly AVWAP Inputs ))))))))))))))))))))))))))

avwap_group = "========== MONTHLY AVWAPS =========="
avwap_source = input.source(hlc3, "Source", group = avwap_group)
avwap_width = input.int(1, "Line Width", minval = 1, maxval = 5, group = avwap_group)
show_avwaps = input.bool(true, "Show AVWAPs", group = avwap_group)
show_labels = input.bool(false, "Show Month Labels", group = avwap_group)
show_anchor_markers = input.bool(true, "Show Anchor Markers", group = avwap_group)

jan_col = input.color(color.new(#6b3e2e, 0), "January",   group = avwap_group)
feb_col = input.color(color.new(#6b3e2e, 0), "February",  group = avwap_group)
mar_col = input.color(color.new(#6b3e2e, 0), "March",     group = avwap_group)
apr_col = input.color(color.new(#6b3e2e, 0), "April",     group = avwap_group)
may_col = input.color(color.new(#6b3e2e, 0), "May",       group = avwap_group)
jun_col = input.color(color.new(#6b3e2e, 0), "June",      group = avwap_group)
jul_col = input.color(color.new(#6b3e2e, 0), "July",      group = avwap_group)
aug_col = input.color(color.new(#6b3e2e, 0), "August",    group = avwap_group)
sep_col = input.color(color.new(#6b3e2e, 0), "September", group = avwap_group)
oct_col = input.color(color.new(#6b3e2e, 0), "October",   group = avwap_group)
nov_col = input.color(color.new(#6b3e2e, 0), "November",  group = avwap_group)
dec_col = input.color(color.new(#6b3e2e, 0), "December",  group = avwap_group)

// (((((((((((((((((((((((((( Session Detection ))))))))))))))))))))))))))

monthly_time = request.security(syminfo.tickerid, "M", time, lookahead = barmerge.lookahead_on)
new_month = ta.change(monthly_time) != 0

current_year = year(timenow, syminfo.timezone)

isFirstBarOfMonth(month_number) =>
    new_month and month(time, syminfo.timezone) == month_number and year(time, syminfo.timezone) == current_year

isCurrentYear() =>
    year(monthly_time, syminfo.timezone) == current_year

in_year = year(time, syminfo.timezone) == current_year

// (((((((((((((((((((((((((( Accumulators ))))))))))))))))))))))))))

var float jan_pv = 0.0
var float jan_v  = 0.0
var float feb_pv = 0.0
var float feb_v  = 0.0
var float mar_pv = 0.0
var float mar_v  = 0.0
var float apr_pv = 0.0
var float apr_v  = 0.0
var float may_pv = 0.0
var float may_v  = 0.0
var float jun_pv = 0.0
var float jun_v  = 0.0
var float jul_pv = 0.0
var float jul_v  = 0.0
var float aug_pv = 0.0
var float aug_v  = 0.0
var float sep_pv = 0.0
var float sep_v  = 0.0
var float oct_pv = 0.0
var float oct_v  = 0.0
var float nov_pv = 0.0
var float nov_v  = 0.0
var float dec_pv = 0.0
var float dec_v  = 0.0

var bool jan_started = false
var bool feb_started = false
var bool mar_started = false
var bool apr_started = false
var bool may_started = false
var bool jun_started = false
var bool jul_started = false
var bool aug_started = false
var bool sep_started = false
var bool oct_started = false
var bool nov_started = false
var bool dec_started = false

// January
if isFirstBarOfMonth(1) or (in_year and month(time, syminfo.timezone) == 1 and not jan_started)
    jan_pv      := avwap_source * volume
    jan_v       := volume
    jan_started := true
else if in_year and jan_started
    jan_pv += avwap_source * volume
    jan_v  += volume
    
// February
if isFirstBarOfMonth(2)
    feb_pv      := avwap_source * volume
    feb_v       := volume
    feb_started := true
else if in_year and feb_started
    feb_pv += avwap_source * volume
    feb_v  += volume

// March
if isFirstBarOfMonth(3)
    mar_pv      := avwap_source * volume
    mar_v       := volume
    mar_started := true
else if in_year and mar_started
    mar_pv += avwap_source * volume
    mar_v  += volume

// April
if isFirstBarOfMonth(4)
    apr_pv      := avwap_source * volume
    apr_v       := volume
    apr_started := true
else if in_year and apr_started
    apr_pv += avwap_source * volume
    apr_v  += volume

// May
if isFirstBarOfMonth(5)
    may_pv      := avwap_source * volume
    may_v       := volume
    may_started := true
else if in_year and may_started
    may_pv += avwap_source * volume
    may_v  += volume

// June
if isFirstBarOfMonth(6)
    jun_pv      := avwap_source * volume
    jun_v       := volume
    jun_started := true
else if in_year and jun_started
    jun_pv += avwap_source * volume
    jun_v  += volume

// July
if isFirstBarOfMonth(7)
    jul_pv      := avwap_source * volume
    jul_v       := volume
    jul_started := true
else if in_year and jul_started
    jul_pv += avwap_source * volume
    jul_v  += volume

// August
if isFirstBarOfMonth(8)
    aug_pv      := avwap_source * volume
    aug_v       := volume
    aug_started := true
else if in_year and aug_started
    aug_pv += avwap_source * volume
    aug_v  += volume

// September
if isFirstBarOfMonth(9)
    sep_pv      := avwap_source * volume
    sep_v       := volume
    sep_started := true
else if in_year and sep_started
    sep_pv += avwap_source * volume
    sep_v  += volume

// October
if isFirstBarOfMonth(10)
    oct_pv      := avwap_source * volume
    oct_v       := volume
    oct_started := true
else if in_year and oct_started
    oct_pv += avwap_source * volume
    oct_v  += volume

// November
if isFirstBarOfMonth(11)
    nov_pv      := avwap_source * volume
    nov_v       := volume
    nov_started := true
else if in_year and nov_started
    nov_pv += avwap_source * volume
    nov_v  += volume

// December
if isFirstBarOfMonth(12)
    dec_pv      := avwap_source * volume
    dec_v       := volume
    dec_started := true
else if in_year and dec_started
    dec_pv += avwap_source * volume
    dec_v  += volume

// Reset flags fora do ano vigente
if not in_year
    jan_started := false
    feb_started := false
    mar_started := false
    apr_started := false
    may_started := false
    jun_started := false
    jul_started := false
    aug_started := false
    sep_started := false
    oct_started := false
    nov_started := false
    dec_started := false

// (((((((((((((((((((((((((( AVWAP Values ))))))))))))))))))))))))))

jan_avwap = in_year and jan_started and jan_v > 0 ? jan_pv / jan_v : na
feb_avwap = in_year and feb_started and feb_v > 0 ? feb_pv / feb_v : na
mar_avwap = in_year and mar_started and mar_v > 0 ? mar_pv / mar_v : na
apr_avwap = in_year and apr_started and apr_v > 0 ? apr_pv / apr_v : na
may_avwap = in_year and may_started and may_v > 0 ? may_pv / may_v : na
jun_avwap = in_year and jun_started and jun_v > 0 ? jun_pv / jun_v : na
jul_avwap = in_year and jul_started and jul_v > 0 ? jul_pv / jul_v : na
aug_avwap = in_year and aug_started and aug_v > 0 ? aug_pv / aug_v : na
sep_avwap = in_year and sep_started and sep_v > 0 ? sep_pv / sep_v : na
oct_avwap = in_year and oct_started and oct_v > 0 ? oct_pv / oct_v : na
nov_avwap = in_year and nov_started and nov_v > 0 ? nov_pv / nov_v : na
dec_avwap = in_year and dec_started and dec_v > 0 ? dec_pv / dec_v : na

jan_anchor = isFirstBarOfMonth(1)
feb_anchor = isFirstBarOfMonth(2)
mar_anchor = isFirstBarOfMonth(3)
apr_anchor = isFirstBarOfMonth(4)
may_anchor = isFirstBarOfMonth(5)
jun_anchor = isFirstBarOfMonth(6)
jul_anchor = isFirstBarOfMonth(7)
aug_anchor = isFirstBarOfMonth(8)
sep_anchor = isFirstBarOfMonth(9)
oct_anchor = isFirstBarOfMonth(10)
nov_anchor = isFirstBarOfMonth(11)
dec_anchor = isFirstBarOfMonth(12)

// (((((((((((((((((((((((((( Monthly AVWAP Plots ))))))))))))))))))))))))))

plot(show_avwaps ? jan_avwap : na, title = "January AVWAP",   color = jan_col, linewidth = avwap_width)
plot(show_avwaps ? feb_avwap : na, title = "February AVWAP",  color = feb_col, linewidth = avwap_width)
plot(show_avwaps ? mar_avwap : na, title = "March AVWAP",     color = mar_col, linewidth = avwap_width)
plot(show_avwaps ? apr_avwap : na, title = "April AVWAP",     color = apr_col, linewidth = avwap_width)
plot(show_avwaps ? may_avwap : na, title = "May AVWAP",       color = may_col, linewidth = avwap_width)
plot(show_avwaps ? jun_avwap : na, title = "June AVWAP",      color = jun_col, linewidth = avwap_width)
plot(show_avwaps ? jul_avwap : na, title = "July AVWAP",      color = jul_col, linewidth = avwap_width)
plot(show_avwaps ? aug_avwap : na, title = "August AVWAP",    color = aug_col, linewidth = avwap_width)
plot(show_avwaps ? sep_avwap : na, title = "September AVWAP", color = sep_col, linewidth = avwap_width)
plot(show_avwaps ? oct_avwap : na, title = "October AVWAP",   color = oct_col, linewidth = avwap_width)
plot(show_avwaps ? nov_avwap : na, title = "November AVWAP",  color = nov_col, linewidth = avwap_width)
plot(show_avwaps ? dec_avwap : na, title = "December AVWAP",  color = dec_col, linewidth = avwap_width)

plot(show_anchor_markers and jan_anchor ? jan_avwap : na, title = "January Anchor",   color = jan_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and feb_anchor ? feb_avwap : na, title = "February Anchor",  color = feb_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and mar_anchor ? mar_avwap : na, title = "March Anchor",     color = mar_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and apr_anchor ? apr_avwap : na, title = "April Anchor",     color = apr_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and may_anchor ? may_avwap : na, title = "May Anchor",       color = may_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and jun_anchor ? jun_avwap : na, title = "June Anchor",      color = jun_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and jul_anchor ? jul_avwap : na, title = "July Anchor",      color = jul_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and aug_anchor ? aug_avwap : na, title = "August Anchor",    color = aug_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and sep_anchor ? sep_avwap : na, title = "September Anchor", color = sep_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and oct_anchor ? oct_avwap : na, title = "October Anchor",   color = oct_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and nov_anchor ? nov_avwap : na, title = "November Anchor",  color = nov_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and dec_anchor ? dec_avwap : na, title = "December Anchor",  color = dec_col, style = plot.style_circles, linewidth = 4, editable = false)

// (((((((((((((((((((((((((( Month Labels ))))))))))))))))))))))))))

var label jan_label = na
var label feb_label = na
var label mar_label = na
var label apr_label = na
var label may_label = na
var label jun_label = na
var label jul_label = na
var label aug_label = na
var label sep_label = na
var label oct_label = na
var label nov_label = na
var label dec_label = na

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

jan_label := show_avwaps ? updateLabel(jan_label, "Jan", jan_avwap, jan_col) : na
feb_label := show_avwaps ? updateLabel(feb_label, "Feb", feb_avwap, feb_col) : na
mar_label := show_avwaps ? updateLabel(mar_label, "Mar", mar_avwap, mar_col) : na
apr_label := show_avwaps ? updateLabel(apr_label, "Apr", apr_avwap, apr_col) : na
may_label := show_avwaps ? updateLabel(may_label, "May", may_avwap, may_col) : na
jun_label := show_avwaps ? updateLabel(jun_label, "Jun", jun_avwap, jun_col) : na
jul_label := show_avwaps ? updateLabel(jul_label, "Jul", jul_avwap, jul_col) : na
aug_label := show_avwaps ? updateLabel(aug_label, "Aug", aug_avwap, aug_col) : na
sep_label := show_avwaps ? updateLabel(sep_label, "Sep", sep_avwap, sep_col) : na
oct_label := show_avwaps ? updateLabel(oct_label, "Oct", oct_avwap, oct_col) : na
nov_label := show_avwaps ? updateLabel(nov_label, "Nov", nov_avwap, nov_col) : na
dec_label := show_avwaps ? updateLabel(dec_label, "Dec", dec_avwap, dec_col) : na