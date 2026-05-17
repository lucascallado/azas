//@version=6
indicator('AVWAPS - Weekly Anchored VWAPs', shorttitle = 'AVWAPS Weekly', overlay = true, max_bars_back = 5000)

// (((((((((((((((((((((((((( Weekly AVWAP Inputs ))))))))))))))))))))))))))

avwap_group = "========== WEEKLY AVWAPS =========="
avwap_source = input.source(hlc3, "Source", group = avwap_group)
avwap_width = input.int(1, "Line Width", minval = 1, maxval = 5, group = avwap_group)
show_avwaps = input.bool(true, "Show AVWAPs", group = avwap_group)
show_labels = input.bool(false, "Show Week Labels", group = avwap_group)
show_anchor_markers = input.bool(true, "Show Anchor Markers", group = avwap_group)

week_0_col = input.color(color.new(#6b3e2e, 0), "Newest Week", group = avwap_group)
week_1_col = input.color(color.new(#6b3e2e, 0), "1 Week Ago", group = avwap_group)
week_2_col = input.color(color.new(#6b3e2e, 0), "2 Weeks Ago", group = avwap_group)
week_3_col = input.color(color.new(#6b3e2e, 0), "3 Weeks Ago", group = avwap_group)
week_4_col = input.color(color.new(#6b3e2e, 0), "4 Weeks Ago", group = avwap_group)

// (((((((((((((((((((((((((( Weekly AVWAP Logic ))))))))))))))))))))))))))

weekly_time = request.security(syminfo.tickerid, "W", time, lookahead = barmerge.lookahead_on)
weekly_year = year(weekly_time, syminfo.timezone)
weekly_week = weekofyear(weekly_time, syminfo.timezone)
latest_year = year(last_bar_time, syminfo.timezone)
latest_week = weekofyear(last_bar_time, syminfo.timezone)
new_week = ta.change(weekly_time) != 0
show_on_weekly_or_lower = timeframe.in_seconds(timeframe.period) <= timeframe.in_seconds("W")
start_new_week = show_on_weekly_or_lower and (new_week or na(weekly_time[1]))

getWeekId(year_number, week_number) =>
    year_number * 53 + week_number

weekly_id = getWeekId(weekly_year, weekly_week)
latest_week_id = getWeekId(latest_year, latest_week)

bar_volume = nz(volume, 0.0)
cumulative_price_volume = ta.cum(avwap_source * bar_volume)
cumulative_volume = ta.cum(bar_volume)

getWeeklyAvwap(simple int weeks_back) =>
    anchor_price_volume = ta.valuewhen(start_new_week, nz(cumulative_price_volume[1], 0.0), weeks_back)
    anchor_volume = ta.valuewhen(start_new_week, nz(cumulative_volume[1], 0.0), weeks_back)
    active_volume = cumulative_volume - anchor_volume
    show_on_weekly_or_lower and active_volume > 0 ? (cumulative_price_volume - anchor_price_volume) / active_volume : na

rolling_week_0_avwap = getWeeklyAvwap(0)
rolling_week_1_avwap = getWeeklyAvwap(1)
rolling_week_2_avwap = getWeeklyAvwap(2)
rolling_week_3_avwap = getWeeklyAvwap(3)
rolling_week_4_avwap = getWeeklyAvwap(4)

var bool is_forex = false
if new_week and dayofweek(time, syminfo.timezone) == dayofweek.sunday
    is_forex := true

week_id_offset = is_forex ? 1 : 0

getFifoWeeklyAvwap(simple int weeks_back_from_latest) =>
    anchor_week_id = latest_week_id - weeks_back_from_latest - week_id_offset
    weeks_since_anchor = weekly_id - anchor_week_id
    fifo_value = weeks_since_anchor == 0 ? rolling_week_0_avwap :
         weeks_since_anchor == 1 ? rolling_week_1_avwap :
         weeks_since_anchor == 2 ? rolling_week_2_avwap :
         weeks_since_anchor == 3 ? rolling_week_3_avwap :
         weeks_since_anchor == 4 ? rolling_week_4_avwap :
         na
    show_on_weekly_or_lower and weeks_since_anchor >= 0 and weeks_since_anchor <= weeks_back_from_latest ? fifo_value : na

padWeek(week_number) =>
    week_number < 10 ? "0" + str.tostring(week_number) : str.tostring(week_number)

getWeekLabel(simple int weeks_back) =>
    anchor_week = ta.valuewhen(start_new_week, weekly_week, weeks_back)
    anchor_year = ta.valuewhen(start_new_week, weekly_year, weeks_back)
    not na(anchor_week) and not na(anchor_year) ? str.tostring(anchor_year) + " W" + padWeek(anchor_week) : ""

week_0_avwap = getFifoWeeklyAvwap(0)
week_1_avwap = getFifoWeeklyAvwap(1)
week_2_avwap = getFifoWeeklyAvwap(2)
week_3_avwap = getFifoWeeklyAvwap(3)
week_4_avwap = getFifoWeeklyAvwap(4)

week_0_anchor = start_new_week and weekly_id == latest_week_id - week_id_offset
week_1_anchor = start_new_week and weekly_id == latest_week_id - 1 - week_id_offset
week_2_anchor = start_new_week and weekly_id == latest_week_id - 2 - week_id_offset
week_3_anchor = start_new_week and weekly_id == latest_week_id - 3 - week_id_offset
week_4_anchor = start_new_week and weekly_id == latest_week_id - 4 - week_id_offset

week_0_text = getWeekLabel(0)
week_1_text = getWeekLabel(1)
week_2_text = getWeekLabel(2)
week_3_text = getWeekLabel(3)
week_4_text = getWeekLabel(4)

// (((((((((((((((((((((((((( Weekly AVWAP Plots ))))))))))))))))))))))))))

plot(show_avwaps ? week_0_avwap : na, title = "Newest Week AVWAP", color = week_0_col, linewidth = avwap_width)
plot(show_avwaps ? week_1_avwap : na, title = "1 Week Ago AVWAP", color = week_1_col, linewidth = avwap_width)
plot(show_avwaps ? week_2_avwap : na, title = "2 Weeks Ago AVWAP", color = week_2_col, linewidth = avwap_width)
plot(show_avwaps ? week_3_avwap : na, title = "3 Weeks Ago AVWAP", color = week_3_col, linewidth = avwap_width)
plot(show_avwaps ? week_4_avwap : na, title = "4 Weeks Ago AVWAP", color = week_4_col, linewidth = avwap_width)

plot(show_anchor_markers and week_0_anchor ? week_0_avwap : na, title = "Newest Week Anchor", color = week_0_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and week_1_anchor ? week_1_avwap : na, title = "1 Week Ago Anchor", color = week_1_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and week_2_anchor ? week_2_avwap : na, title = "2 Weeks Ago Anchor", color = week_2_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and week_3_anchor ? week_3_avwap : na, title = "3 Weeks Ago Anchor", color = week_3_col, style = plot.style_circles, linewidth = 4, editable = false)
plot(show_anchor_markers and week_4_anchor ? week_4_avwap : na, title = "4 Weeks Ago Anchor", color = week_4_col, style = plot.style_circles, linewidth = 4, editable = false)

// (((((((((((((((((((((((((( Week Labels ))))))))))))))))))))))))))

var label week_0_label = na
var label week_1_label = na
var label week_2_label = na
var label week_3_label = na
var label week_4_label = na

updateLabel(label_id, label_text, label_value, label_color) =>
    if show_labels and barstate.islast and not na(label_value) and label_text != ""
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

week_0_label := show_avwaps ? updateLabel(week_0_label, week_0_text, week_0_avwap, week_0_col) : na
week_1_label := show_avwaps ? updateLabel(week_1_label, week_1_text, week_1_avwap, week_1_col) : na
week_2_label := show_avwaps ? updateLabel(week_2_label, week_2_text, week_2_avwap, week_2_col) : na
week_3_label := show_avwaps ? updateLabel(week_3_label, week_3_text, week_3_avwap, week_3_col) : na
week_4_label := show_avwaps ? updateLabel(week_4_label, week_4_text, week_4_avwap, week_4_col) : na