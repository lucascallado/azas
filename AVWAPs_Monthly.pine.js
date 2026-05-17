//@version=6
indicator('AVWAPS - Monthly Anchored VWAPs', shorttitle = 'AVWAPS', overlay = true, max_bars_back = 5000)

// (((((((((((((((((((((((((( Monthly AVWAP Inputs ))))))))))))))))))))))))))

avwap_group = "========== MONTHLY AVWAPS =========="
avwap_source = input.source(hlc3, "Source", group = avwap_group)
avwap_width = input.int(1, "Line Width", minval = 1, maxval = 5, group = avwap_group)
show_avwaps = input.bool(true, "Show AVWAPs", group = avwap_group)
show_labels = input.bool(false, "Show Month Labels", group = avwap_group)
show_anchor_markers = input.bool(true, "Show Anchor Markers", group = avwap_group)

jan_col = input.color(color.new(#6b3e2e, 0), "January", group = avwap_group)
feb_col = input.color(color.new(#6b3e2e, 0), "February", group = avwap_group)
mar_col = input.color(color.new(#6b3e2e, 0), "March", group = avwap_group)
apr_col = input.color(color.new(#6b3e2e, 0), "April", group = avwap_group)
may_col = input.color(color.new(#6b3e2e, 0), "May", group = avwap_group)
jun_col = input.color(color.new(#6b3e2e, 0), "June", group = avwap_group)
jul_col = input.color(color.new(#6b3e2e, 0), "July", group = avwap_group)
aug_col = input.color(color.new(#6b3e2e, 0), "August", group = avwap_group)
sep_col = input.color(color.new(#6b3e2e, 0), "September", group = avwap_group)
oct_col = input.color(color.new(#6b3e2e, 0), "October", group = avwap_group)
nov_col = input.color(color.new(#6b3e2e, 0), "November", group = avwap_group)
dec_col = input.color(color.new(#6b3e2e, 0), "December", group = avwap_group)

// (((((((((((((((((((((((((( Monthly AVWAP Logic ))))))))))))))))))))))))))

current_year = year(timenow, syminfo.timezone)
monthly_time = time("M")
monthly_year = year(monthly_time, syminfo.timezone)
monthly_month = month(monthly_time, syminfo.timezone)
new_month = timeframe.change("M")
show_on_monthly_or_lower = timeframe.in_seconds(timeframe.period) <= timeframe.in_seconds("M")

getMonthlyAvwap(month_number) =>
    is_active = show_on_monthly_or_lower and monthly_year == current_year and monthly_month >= month_number
    cumulative_price_volume = ta.cum(is_active ? avwap_source * volume : 0.0)
    cumulative_volume = ta.cum(is_active ? volume : 0.0)
    cumulative_volume > 0 ? cumulative_price_volume / cumulative_volume : na

isMonthlyAnchor(month_number) =>
    show_on_monthly_or_lower and new_month and monthly_year == current_year and monthly_month == month_number

jan_avwap = getMonthlyAvwap(1)
feb_avwap = getMonthlyAvwap(2)
mar_avwap = getMonthlyAvwap(3)
apr_avwap = getMonthlyAvwap(4)
may_avwap = getMonthlyAvwap(5)
jun_avwap = getMonthlyAvwap(6)
jul_avwap = getMonthlyAvwap(7)
aug_avwap = getMonthlyAvwap(8)
sep_avwap = getMonthlyAvwap(9)
oct_avwap = getMonthlyAvwap(10)
nov_avwap = getMonthlyAvwap(11)
dec_avwap = getMonthlyAvwap(12)

jan_anchor = isMonthlyAnchor(1)
feb_anchor = isMonthlyAnchor(2)
mar_anchor = isMonthlyAnchor(3)
apr_anchor = isMonthlyAnchor(4)
may_anchor = isMonthlyAnchor(5)
jun_anchor = isMonthlyAnchor(6)
jul_anchor = isMonthlyAnchor(7)
aug_anchor = isMonthlyAnchor(8)
sep_anchor = isMonthlyAnchor(9)
oct_anchor = isMonthlyAnchor(10)
nov_anchor = isMonthlyAnchor(11)
dec_anchor = isMonthlyAnchor(12)

// (((((((((((((((((((((((((( Monthly AVWAP Plots ))))))))))))))))))))))))))

plot(show_avwaps ? jan_avwap : na, title = "January AVWAP", color = jan_col, linewidth = avwap_width)
plot(show_avwaps ? feb_avwap : na, title = "February AVWAP", color = feb_col, linewidth = avwap_width)
plot(show_avwaps ? mar_avwap : na, title = "March AVWAP", color = mar_col, linewidth = avwap_width)
plot(show_avwaps ? apr_avwap : na, title = "April AVWAP", color = apr_col, linewidth = avwap_width)
plot(show_avwaps ? may_avwap : na, title = "May AVWAP", color = may_col, linewidth = avwap_width)
plot(show_avwaps ? jun_avwap : na, title = "June AVWAP", color = jun_col, linewidth = avwap_width)
plot(show_avwaps ? jul_avwap : na, title = "July AVWAP", color = jul_col, linewidth = avwap_width)
plot(show_avwaps ? aug_avwap : na, title = "August AVWAP", color = aug_col, linewidth = avwap_width)
plot(show_avwaps ? sep_avwap : na, title = "September AVWAP", color = sep_col, linewidth = avwap_width)
plot(show_avwaps ? oct_avwap : na, title = "October AVWAP", color = oct_col, linewidth = avwap_width)
plot(show_avwaps ? nov_avwap : na, title = "November AVWAP", color = nov_col, linewidth = avwap_width)
plot(show_avwaps ? dec_avwap : na, title = "December AVWAP", color = dec_col, linewidth = avwap_width)

plot(show_anchor_markers and jan_anchor ? jan_avwap : na, title = "January Anchor", color = jan_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and feb_anchor ? feb_avwap : na, title = "February Anchor", color = feb_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and mar_anchor ? mar_avwap : na, title = "March Anchor", color = mar_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and apr_anchor ? apr_avwap : na, title = "April Anchor", color = apr_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and may_anchor ? may_avwap : na, title = "May Anchor", color = may_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and jun_anchor ? jun_avwap : na, title = "June Anchor", color = jun_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and jul_anchor ? jul_avwap : na, title = "July Anchor", color = jul_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and aug_anchor ? aug_avwap : na, title = "August Anchor", color = aug_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and sep_anchor ? sep_avwap : na, title = "September Anchor", color = sep_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and oct_anchor ? oct_avwap : na, title = "October Anchor", color = oct_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and nov_anchor ? nov_avwap : na, title = "November Anchor", color = nov_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and dec_anchor ? dec_avwap : na, title = "December Anchor", color = dec_col, style = plot.style_circles, linewidth = 4, editable = false)

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

