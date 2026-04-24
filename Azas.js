//@version=6
indicator('AZAS - Axis Zones Analysis System', shorttitle = 'AZAS', overlay = true, max_bars_back = 500, max_boxes_count = 500)

// (((((((((((((((((((((((((( LTF Candle Projection Inputs ))))))))))))))))))))))))))

ltf_group = "========== LTF CANDLE PROJECTION =========="
ltf_enabled = input.bool(false, "LTF", group=ltf_group)
var ltf = input.timeframe('', 'Timeframe', inline = 'tf', group = ltf_group)
var ltf_auto = input.bool(true, 'Set Automatically', inline = 'tf', group = ltf_group)
var ltf_2lvs = input.bool(true, 'Two Levels', inline = 'tf', group = ltf_group)
var ltfnum = input.int(2, 'Number of Candles', minval = 1, group = ltf_group)
var ltfoffset = input.int(30, 'Offset', group = ltf_group)
var ltfsize = input.string('Small', 'Size', options = ['Small', 'Medium', 'Large'], group = ltf_group)
var ltftype = input.string('Candles', 'Type', options = ['Candles', 'Heikin Ashi'], group = ltf_group)
var ltfmargin = input.int(1, 'Margin', minval = 1, group = ltf_group)
var ltf_data = input.string('Weekly', 'Use data to generate candles', options = ['Weekly', 'Always', 'Never'], group = ltf_group)
var ltfup_col_wick = input.color(color.new(#151e23, 0), 'Up Wick', inline = 'Wicks', group = ltf_group)
var ltfup_col_border = input.color(color.new(#151e23, 0), 'Up Border', inline = 'Wicks', group = ltf_group)
var ltfdown_col_wick = input.color(color.new(#151e23, 0), 'Down Wick', inline = 'Wicks', group = ltf_group)
var ltfdown_col_border = input.color(color.new(#151e23, 0), 'Down Border', inline = 'Wicks', group = ltf_group)
var ltfo_col = input.color(color.new(#151e23, 0), '', inline = 'o', group = ltf_group)
var ltfo_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'o', group = ltf_group)
var ltfo_width = input.int(1, 'Width', minval = 1, inline = 'o', group = ltf_group)
var ltfo_enabled = input.bool(true, 'Open', inline = 'o', group = ltf_group)
var ltfhl_col = input.color(color.new(#151e23, 70), '', inline = 'hl', group = ltf_group)
var ltfhl_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'hl', group = ltf_group)
var ltfhl_width = input.int(1, 'Width', minval = 1, inline = 'hl', group = ltf_group)
var ltfhl_enabled = input.bool(false, 'High/Low', inline = 'hl', group = ltf_group)
var ltfc_col = input.color(color.new(#151e23, 0), '', inline = 'c', group = ltf_group)
var ltfc_style = input.string('Dotted', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'c', group = ltf_group)
var ltfc_width = input.int(1, 'Width', minval = 1, inline = 'c', group = ltf_group)
var ltfc_enabled = input.bool(true, 'Close', inline = 'c', group = ltf_group)
var ltfohlc_col = input.color(color.new(#151e23, 70), '', inline = 'ohlc', group = ltf_group)
var ltfohlc_size = input.string('Auto', '', options = ['Auto', 'Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ohlc', group = ltf_group)
var ltfohlc_enabled = input.bool(false, 'Prices', inline = 'ohlc', group = ltf_group)

var ltfret_enabled = input.bool(false, 'Retracement Prices', group=ltf_group)
var ltfret_max_col = input.color(color.new(#151e23, 0), '', inline = 'ret_max', group=ltf_group)
var ltfret_max_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_max', group=ltf_group)
var ltfret_max_enabled = input.bool(false, 'High (100%)', inline = 'ret_max', group=ltf_group)
var ltfret_67_col = input.color(color.new(#151e23, 0), '', inline = 'ret_67', group=ltf_group)
var ltfret_67_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_67', group=ltf_group)
var ltfret_67_enabled = input.bool(false, '2/3 (66.67%)', inline = 'ret_67', group=ltf_group)
var ltfret_50_col = input.color(color.new(#151e23, 0), '', inline = 'ret_50', group=ltf_group)
var ltfret_50_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_50', group=ltf_group)
var ltfret_50_enabled = input.bool(false, '1/2 (50%)', inline = 'ret_50', group=ltf_group)
var ltfret_33_col = input.color(color.new(#151e23, 0), '', inline = 'ret_33', group=ltf_group)
var ltfret_33_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_33', group=ltf_group)
var ltfret_33_enabled = input.bool(false, '1/3 (33.33%)', inline = 'ret_33', group=ltf_group)
var ltfret_min_col = input.color(color.new(#151e23, 0), '', inline = 'ret_min', group=ltf_group)
var ltfret_min_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_min', group=ltf_group)
var ltfret_min_enabled = input.bool(false, 'Low (0%)', inline = 'ret_min', group=ltf_group)

var ltflines_enabled = input.bool(true, 'Retracement Lines', group=ltf_group)
var ltflines_extend = input.bool(false, 'Extend to Right', group=ltf_group)
var ltfline_max_col = input.color(color.new(#151e23, 0), '', inline = 'line_max', group=ltf_group)
var ltfline_max_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_max', group=ltf_group)
var ltfline_max_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_max', group=ltf_group)
var ltfline_max_enabled = input.bool(true, 'High Line', inline = 'line_max', group=ltf_group)
var ltfline_67_col = input.color(color.new(#151e23, 0), '', inline = 'line_67', group=ltf_group)
var ltfline_67_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_67', group=ltf_group)
var ltfline_67_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_67', group=ltf_group)
var ltfline_67_enabled = input.bool(true, '2/3 Line', inline = 'line_67', group=ltf_group)
var ltfline_50_col = input.color(color.new(#6b3e2e, 0), '', inline = 'line_50', group=ltf_group)
var ltfline_50_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_50', group=ltf_group)
var ltfline_50_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_50', group=ltf_group)
var ltfline_50_enabled = input.bool(true, '1/2 Line', inline = 'line_50', group=ltf_group)
var ltfline_33_col = input.color(color.new(#151e23, 0), '', inline = 'line_33', group=ltf_group)
var ltfline_33_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_33', group=ltf_group)
var ltfline_33_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_33', group=ltf_group)
var ltfline_33_enabled = input.bool(true, '1/3 Line', inline = 'line_33', group=ltf_group)
var ltfline_min_col = input.color(color.new(#151e23, 0), '', inline = 'line_min', group=ltf_group)
var ltfline_min_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_min', group=ltf_group)
var ltfline_min_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_min', group=ltf_group)
var ltfline_min_enabled = input.bool(true, 'Low Line', inline = 'line_min', group=ltf_group)

var ltfzones_enabled = input.bool(true, 'Retracement Zones', group=ltf_group)
var ltfzones_extend = input.bool(false, 'Extend to Right', group=ltf_group)
var ltfzone1_col = input.color(color.new(#151e23, 100), 'Zone 1 (High → 2/3)', group=ltf_group)
var ltfzone2_col = input.color(color.new(#151e23, 84), 'Zone 2 (2/3 → 1/2)', group=ltf_group)
var ltfzone3_col = input.color(color.new(#151e23, 84), 'Zone 3 (1/2 → 1/3)', group=ltf_group)
var ltfzone4_col = input.color(color.new(#151e23, 100), 'Zone 4 (1/3 → Low)', group=ltf_group)

// (((((((((((((((((((((((((( HTF Candle Projection Inputs ))))))))))))))))))))))))))

htf_group = "========== HTF CANDLE PROJECTION =========="
htf_enabled = input.bool(false, "HTF", group=htf_group)
var htf = input.timeframe('', 'Timeframe', inline = 'tf', group = htf_group)
var htf_auto = input.bool(true, 'Set Automatically', inline = 'tf', group = htf_group)
var htf_2lvs = input.bool(true, 'Two Levels', inline = 'tf', group = htf_group)
var htfnum = input.int(2, 'Number of Candles', minval = 1, group = htf_group)
var htfoffset = input.int(45, 'Offset', group = htf_group)
var htfsize = input.string('Small', 'Size', options = ['Small', 'Medium', 'Large'], group = htf_group)
var htftype = input.string('Candles', 'Type', options = ['Candles', 'Heikin Ashi'], group = htf_group)
var htfmargin = input.int(1, 'Margin', minval = 1, group = htf_group)
var htf_data = input.string('Weekly', 'Use data to generate candles', options = ['Weekly', 'Always', 'Never'], group = htf_group)
var htfup_col_wick = input.color(color.new(#151e23, 0), 'Up Wick', inline = 'Wicks', group = htf_group)
var htfup_col_border = input.color(color.new(#151e23, 0), 'Up Border', inline = 'Wicks', group = htf_group)
var htfdown_col_wick = input.color(color.new(#151e23, 0), 'Down Wick', inline = 'Wicks', group = htf_group)
var htfdown_col_border = input.color(color.new(#151e23, 0), 'Down Border', inline = 'Wicks', group = htf_group)
var htfo_col = input.color(color.new(#151e23, 0), '', inline = 'o', group = htf_group)
var htfo_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'o', group = htf_group)
var htfo_width = input.int(1, 'Width', minval = 1, inline = 'o', group = htf_group)
var htfo_enabled = input.bool(true, 'Open', inline = 'o', group = htf_group)
var htfhl_col = input.color(color.new(#151e23, 70), '', inline = 'hl', group = htf_group)
var htfhl_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'hl', group = htf_group)
var htfhl_width = input.int(1, 'Width', minval = 1, inline = 'hl', group = htf_group)
var htfhl_enabled = input.bool(false, 'High/Low', inline = 'hl', group = htf_group)
var htfc_col = input.color(color.new(#151e23, 0), '', inline = 'c', group = htf_group)
var htfc_style = input.string('Dotted', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'c', group = htf_group)
var htfc_width = input.int(2, 'Width', minval = 1, inline = 'c', group = htf_group)
var htfc_enabled = input.bool(true, 'Close', inline = 'c', group = htf_group) 
var htfohlc_col = input.color(color.new(#151e23, 70), '', inline = 'ohlc', group = htf_group)
var htfohlc_size = input.string('Auto', '', options = ['Auto', 'Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ohlc', group = htf_group)
var htfohlc_enabled = input.bool(false, 'Prices', inline = 'ohlc', group = htf_group)

var htfret_enabled = input.bool(false, 'Retracement Prices', group = htf_group)
var htfret_max_col = input.color(color.new(#151e23, 0), '', inline = 'ret_max', group = htf_group)
var htfret_max_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_max', group = htf_group)
var htfret_max_enabled = input.bool(false, 'High (100%)', inline = 'ret_max', group = htf_group)
var htfret_67_col = input.color(color.new(#151e23, 0), '', inline = 'ret_67', group = htf_group)
var htfret_67_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_67', group = htf_group)
var htfret_67_enabled = input.bool(false, '2/3 (66.67%)', inline = 'ret_67', group = htf_group)
var htfret_50_col = input.color(color.new(#151e23, 0), '', inline = 'ret_50', group = htf_group)
var htfret_50_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_50', group = htf_group)
var htfret_50_enabled = input.bool(false, '1/2 (50%)', inline = 'ret_50', group = htf_group)
var htfret_33_col = input.color(color.new(#151e23, 0), '', inline = 'ret_33', group = htf_group)
var htfret_33_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_33', group = htf_group)
var htfret_33_enabled = input.bool(false, '1/3 (33.33%)', inline = 'ret_33', group = htf_group)
var htfret_min_col = input.color(color.new(#151e23, 0), '', inline = 'ret_min', group = htf_group)
var htfret_min_size = input.string('Small', '', options = ['Tiny', 'Small', 'Normal', 'Large', 'Huge'], inline = 'ret_min', group = htf_group)
var htfret_min_enabled = input.bool(false, 'Low (0%)', inline = 'ret_min', group = htf_group)

var htflines_enabled = input.bool(true, 'Retracement Lines', group = htf_group)
var htflines_extend = input.bool(false, 'Extend to Right', group = htf_group)
var htfline_max_col = input.color(color.new(#151e23, 0), '', inline = 'line_max', group = htf_group)
var htfline_max_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_max', group = htf_group)
var htfline_max_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_max', group = htf_group)
var htfline_max_enabled = input.bool(true, 'High Line', inline = 'line_max', group = htf_group)
var htfline_67_col = input.color(color.new(#151e23, 0), '', inline = 'line_67', group = htf_group)
var htfline_67_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_67', group = htf_group)
var htfline_67_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_67', group = htf_group)
var htfline_67_enabled = input.bool(true, '2/3 Line', inline = 'line_67', group = htf_group)
var htfline_50_col = input.color(color.new(#6b3e2e, 0), '', inline = 'line_50', group = htf_group)
var htfline_50_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_50', group = htf_group)
var htfline_50_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_50', group = htf_group)
var htfline_50_enabled = input.bool(true, '1/2 Line', inline = 'line_50', group = htf_group)
var htfline_33_col = input.color(color.new(#151e23, 0), '', inline = 'line_33', group = htf_group)
var htfline_33_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_33', group = htf_group)
var htfline_33_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_33', group = htf_group)
var htfline_33_enabled = input.bool(true, '1/3 Line', inline = 'line_33', group = htf_group)
var htfline_min_col = input.color(color.new(#151e23, 0), '', inline = 'line_min', group = htf_group)
var htfline_min_style = input.string('Solid', '', options = ['Solid', 'Dotted', 'Dashed'], inline = 'line_min', group = htf_group)
var htfline_min_width = input.int(1, 'Width', minval = 1, maxval = 5, inline = 'line_min', group = htf_group)
var htfline_min_enabled = input.bool(true, 'Low Line', inline = 'line_min', group = htf_group)

var htfzones_enabled = input.bool(true, 'Retracement Zones', group = htf_group)
var htfzones_extend = input.bool(false, 'Extend to Right', group = htf_group)
var htfzone1_col = input.color(color.new(#151e23, 100), 'Zone 1 (High → 2/3)', group = htf_group)
var htfzone2_col = input.color(color.new(#151e23, 84), 'Zone 2 (2/3 → 1/2)', group = htf_group)
var htfzone3_col = input.color(color.new(#151e23, 84), 'Zone 3 (1/2 → 1/3)', group = htf_group)
var htfzone4_col = input.color(color.new(#151e23, 100), 'Zone 4 (1/3 → Low)', group = htf_group)

// (((((((((((((((((((((((((( Period Separator Inputs ))))))))))))))))))))))))))

PeriodSeparator_group = "========== Period Separator =========="
PeriodSeparator_enable = input.bool(true, "Period Separator", group = PeriodSeparator_group)
PeriodSeparator_color = input.color(#151e23, "Color", group = PeriodSeparator_group)
PeriodSeparator_style = input.string("Dotted", "Style", options = ["Solid", "Dashed", "Dotted"], group = PeriodSeparator_group)
PeriodSeparator_width = input.int(1, "Width", minval = 1, group = PeriodSeparator_group)
PeriodSeparator_timeframe = input.timeframe("M", "Timeframe", group = PeriodSeparator_group)

// (((((((((((((((((((((((((( Candle Color Progression Inputs ))))))))))))))))))))))))))

CCP_group = "========== Candle Color Progression =========="
CCP_length = input.int(26, "Length", minval=1, group = CCP_group)
CCP_source_options = input.string("Trail Axis", "Source", options=["Close", "Open", "High", "Low", "HL2", "HLC3", "OHLC4", "Trial Alpha", "Trial Omega", "Trail Axis", "Trial Alpha Source 2", "Trial Omega Source 2", "Transition Alpha", "Transition Omega"], group = CCP_group)
CCP_ema_len = input.int(2, "EMA Length", minval=1, group = CCP_group)
CCP_zone1 = input.float(0.5, "Zone 1", minval=0.001, maxval=50, step=0.1, group = CCP_group)
CCP_zone2 = input.float(1.0, "Zone 2", minval=0.001, maxval=50, step=0.1, group = CCP_group)
CCP_zone3 = input.float(1.5, "Zone 3", minval=0.001, maxval=50, step=0.1, group = CCP_group)
CCP_zone4 = input.float(2.0, "Zone 4", minval=0.001, maxval=50, step=0.1, group = CCP_group)
CCP_enable_candle_color = input.bool(true, "Candle Coloring", group = CCP_group)
candle_color_basis_zone1_upper_bull = input.color(color.new(#bbd9fb, 0), "Basis-Z1 Upper Bullish Candle Color", group = CCP_group)
candle_color_basis_zone1_upper_bear = input.color(color.new(#ffb74d, 0), "Basis-Z1 Upper Bearish Candle Color", group = CCP_group)
candle_color_basis_zone1_lower_bull = input.color(color.new(#81c784, 0), "Basis-Z1 Lower Bullish Candle Color", group = CCP_group)
candle_color_basis_zone1_lower_bear = input.color(color.new(#fccbcd, 0), "Basis-Z1 Lower Bearish Candle Color", group = CCP_group)
candle_color_zone1_zone2_upper_bull = input.color(color.new(#3179f5, 0), "Z1-Z2 Upper Bullish Candle Color", group = CCP_group)
candle_color_zone1_zone2_upper_bear = input.color(color.new(#ffb74d, 0), "Z1-Z2 Upper Bearish Candle Color", group = CCP_group)
candle_color_zone1_zone2_lower_bull = input.color(color.new(#81c784, 0), "Z1-Z2 Lower Bullish Candle Color", group = CCP_group)
candle_color_zone1_zone2_lower_bear = input.color(color.new(#f7525f, 0), "Z1-Z2 Lower Bearish Candle Color", group = CCP_group)
candle_color_zone2_zone3_upper_bull = input.color(color.new(#0c3299, 0), "Z2-Z3 Upper Bullish Candle Color", group = CCP_group)
candle_color_zone2_zone3_upper_bear = input.color(color.new(#ffb74d, 0), "Z2-Z3 Upper Bearish Candle Color", group = CCP_group)
candle_color_zone2_zone3_lower_bull = input.color(color.new(#81c784, 0), "Z2-Z3 Lower Bullish Candle Color", group = CCP_group)
candle_color_zone2_zone3_lower_bear = input.color(color.new(#801922, 0), "Z2-Z3 Lower Bearish Candle Color", group = CCP_group)
candle_color_zone3_zone4_upper_bull = input.color(color.new(#ffffff, 0), "Z3-Z4 Upper Bullish Candle Color", group = CCP_group)
candle_color_zone3_zone4_upper_bear = input.color(color.new(#ffb74d, 0), "Z3-Z4 Upper Bearish Candle Color", group = CCP_group)
candle_color_zone3_zone4_lower_bull = input.color(color.new(#81c784, 0), "Z3-Z4 Lower Bullish Candle Color", group = CCP_group)
candle_color_zone3_zone4_lower_bear = input.color(color.new(#000000, 0), "Z3-Z4 Lower Bearish Candle Color", group = CCP_group)

// (((((((((((((((((((((((((( Volume Signals Inputs ))))))))))))))))))))))))))

Vol_group = "========== Volume Signals =========="
Vol_enable = input.bool(true, "Signals", group=Vol_group)
Vol_bullsih_signal = input.string("˚", "Bullish Signal", group=Vol_group)
Vol_bearish_signal = input.string("˚", "Bearish Signal", group=Vol_group)
Vol_bullsih_color = input.color(#ffffff, "Bullish Color", group=Vol_group)
Vol_bearish_color = input.color(#000000, "Bearish Color", group=Vol_group)

// (((((((((((((((((((((((((( Trigger Axis Inputs ))))))))))))))))))))))))))

TriggerAxis_group = "========== Trigger Axis =========="
TriggerAxis_enabled = input.bool(true, title="Trigger Axis", group = TriggerAxis_group)
TriggerAxis_length = input.int(20, minval=1, title="Length", group = TriggerAxis_group)
TriggerAxis_src = input.source(close, title="Source", group = TriggerAxis_group)
TriggerAxis_ema_len = input.int(2, minval=1, title="EMA Length", group = TriggerAxis_group)
TriggerAxis_mult = input.float(1, minval=0.001, maxval=50, step=0.1, title="Multiplier", group = TriggerAxis_group)
TriggerAxis_width = input.int(4, minval=1, maxval=4, title="Width", group = TriggerAxis_group)
TriggerAxis_bullish_color = input.color(color.new(#0c3299, 85), title="Bullish Color", group = TriggerAxis_group)
TriggerAxis_bearish_color = input.color(color.new(#801922, 85), title="Bearish Color", group = TriggerAxis_group)
TriggerAxis_bullish_shadow_color = input.color(color.new(#81c784, 100), title="Bullish Shadow Color", group = TriggerAxis_group)
TriggerAxis_bearish_shadow_color = input.color(color.new(#ffb74d, 100), title="Bearish Shadow Color", group = TriggerAxis_group)
TriggerAxis_enable_signals = input.bool(true, title="Signals", group = TriggerAxis_group)

// (((((((((((((((((((((((((( Trail Zone Inputs ))))))))))))))))))))))))))

TrailZone_group = "========== Trail Axis =========="
TrailZone_enabled = input.bool(true,  "Trail Zone", group=TrailZone_group)
TrailAxis_enabled = input.bool(true, "Trail Axis", group=TrailZone_group)
TrailZone_atr_len = input.int(26, "ATR Period", minval=1, group=TrailZone_group)
TrailZone_atr_mult = input.float(0.5, "ATR Multiplier", minval=0.01, step=0.05, group=TrailZone_group)
TrailAxis_width = input.int(2, "Width", minval=1, maxval=4, group=TrailZone_group)
TrailZone_transp = input.int(80, "Fill Transparency (0-100)", minval=0, maxval=100, group=TrailZone_group)
TrailAxis_bullish = input.color(#bbd9fb, "Bullish Color", group=TrailZone_group)
TrailAxis_bearish = input.color(#fccbcd, "Bearish Color", group=TrailZone_group)
TrailAxis_enable_Signals = input.bool(true, title="Signals", group=TrailZone_group)
TrailAxis_candles_crossing_bullish = input.color(#ffffff, title="Trail Axis x Candles Bullish Signal Color", group=TrailZone_group)
TrailAxis_candles_crossing_bearish = input.color(#000000, title="Trail Axis x Candles Bearish Signal Color", group=TrailZone_group)
TrailAxis_transition_alpha_crossing_bullish = input.color(#ffffff, title="Trail Axis x Transition Alpha Bullish Signal Color", group=TrailZone_group)
TrailAxis_transition_alpha_crossing_bearish = input.color(#000000, title="Trail Axis x Transition Alpha Bearish Signal Color", group=TrailZone_group)
TrailAxis_transition_omega_crossing_bullish = input.color(#ffffff, title="Trail Axis x Transition Omega Bullish Signal Color", group=TrailZone_group)
TrailAxis_transition_omega_crossing_bearish = input.color(#000000, title="Trail Axis x Transition Omega Bearish Signal Color", group=TrailZone_group)

// (((((((((((((((((((((((((( Trial Zone Inputs ))))))))))))))))))))))))))

TrialZone_group = "========== Trial Zone =========="
TrialZone_enable = input.bool(true, "Trial Zone", group=TrialZone_group)
TrialAxis_enabled = input.bool(true, "Trial Axis", group=TrialZone_group)
TrialZone_conversion = input.int(9,  minval=1, title="Conversion", group=TrialZone_group)
TrialZone_base = input.int(9, minval=1, title="Base", group=TrialZone_group)
TrialZone_displacement = input.int(26, minval=1, title="Displacement", group=TrialZone_group)
TrialZone_Lagging = input.int(1,  minval=1, title="Lagging", group=TrialZone_group)
TrialAxis_width = input.int(2, "Width", minval=1, maxval=4, group=TrialZone_group)
TrialZone_transp = input.int(80, "Fill Transparency (0-100)", minval=0, maxval=100, group=TrialZone_group)
TrialZone_bullish = input.color(#bbd9fb, "Bullish Color", group=TrialZone_group)
TrialZone_bearish = input.color(#fccbcd, "Bearish Color", group=TrialZone_group)

// (((((((((((((((((((((((((( Core Zone Inputs ))))))))))))))))))))))))))

CoreZone_group = "========== Core Zone =========="
CoreZone_enable = input.bool(true, "Core Zone", group=CoreZone_group)
CoreAxis_enabled = input.bool(true, "Core Axis", group=CoreZone_group)
CoreAxis_width = input.int(2, "Width", minval=1, maxval=4, group=CoreZone_group)
CoreZone_bullish_fill = input.color(color.new(#bbd9fb, 80), "Bullish Fill", group=CoreZone_group)
CoreZone_bearish_fill = input.color(color.new(#fccbcd, 80), "Bearish Fill", group=CoreZone_group)
CoreAxis_bullish_color = input.color(color.new(#0c3299, 30), "Bullish Color", group=CoreZone_group)
CoreAxis_bearish_color = input.color(color.new(#801922, 30), "Bearish Color", group=CoreZone_group)

// (((((((((((((((((((((((((( Transition Zone Inputs ))))))))))))))))))))))))))

TransitionZone_group = "========== Transition Zone =========="
TransitionZone_enable = input.bool(true, "Transition Zone", group=TransitionZone_group)
TransitionAxis_enabled = input.bool(true, "Transition Axis", group=TransitionZone_group)
TransitionZone_conversion = input.int(9,  minval=1, title="Conversion", group=TransitionZone_group)
TransitionZone_base = input.int(26, minval=1, title="Base", group=TransitionZone_group)
TransitionZone_displacement = input.int(52, minval=1, title="Displacement", group=TransitionZone_group)
TransitionZone_lagging = input.int(26, minval=1, title="Lagging", group=TransitionZone_group)
TransitionAxis_width = input.int(2, "Width", minval=1, maxval=4, group=TransitionZone_group)
TransitionZone_transp = input.int(80, "Fill Transparency (0-100)", minval=0, maxval=100, group=TransitionZone_group)
TransitionZone_bullish = input.color(#bbd9fb, "Bullish Color", group=TransitionZone_group)
TransitionZone_bearish = input.color(#fccbcd, "Bearish Color", group=TransitionZone_group)
TransitionZone_enable_signals = input.bool(true, "Signals", group=TransitionZone_group)
TransitionZone_bullish_signal_color = input.color(color.new(#ffffff, 0), "Bullish Signal Color", group=TransitionZone_group)
TransitionZone_bearish_signal_color = input.color(color.new(#000000, 0), "Bearish Signal Color", group=TransitionZone_group)
TransitionZone_neutral_signal_color = input.color(color.new(#b8b8b8, 0), "Neutral Signal Color", group=TransitionZone_group)
Candles_TransitionOmega_crossing_signal_enabled = input.bool(true, "Candles X Transition Omega Signals", group=TransitionZone_group)
Candles_transitionomega_crossing_bullish = input.color(color.new(#ffffff, 0), "Candles X Transition Omega Bullish Signal Color", group=TransitionZone_group)
Candles_TransitionOmega_crossing_bearish = input.color(color.new(#000000, 0), "Candles X Transition Omega Bearish Signal Color", group=TransitionZone_group)

// (((((((((((((((((((((((((( Unified Calculation ))))))))))))))))))))))))))

donchian_UniCal(len) => math.avg(ta.lowest(len), ta.highest(len))
UniCal_conversion = 9 
UniCal_base = 26 
UniCal_displacement = 52 
UniCal_base2 = 9 
UniCal_lagging = 26 
UniCal_trialalpha_source = donchian_UniCal(UniCal_conversion) 
UniCal_trialalpha_basesource = donchian_UniCal(UniCal_base2) 
UniCal_trialalpha_source2 = math.avg(UniCal_trialalpha_source, UniCal_trialalpha_basesource)
UniCal_trialomega_source = donchian_UniCal(UniCal_base) 
UniCal_trialomega_source2 = donchian_UniCal(UniCal_lagging) 
UniCal_transitionalpha_source = math.avg(UniCal_trialalpha_source, UniCal_trialomega_source) 
UniCal_transitionomega_source = donchian_UniCal(UniCal_displacement) 
unical_trailaxis = close 

// (((((((((((((((((((((((((( Volume Calculation ))))))))))))))))))))))))))

isBullish = close > open
isBearish = close < open
twoBullish = isBullish and close[1] > open[1]
twoBearish = isBearish and close[1] < open[1]
volBullish = Vol_enable and twoBullish and volume > volume[1]
volBearish = Vol_enable and twoBearish and volume > volume[1]

// (((((((((((((((((((((((((( Trigger Axis Calculation ))))))))))))))))))))))))))

TriggerAxis_price = ta.ema(TriggerAxis_src, TriggerAxis_ema_len)
TriggerAxis_basis = ta.sma(TriggerAxis_src, TriggerAxis_length)
TriggerAxis_stdev_value = ta.stdev(TriggerAxis_src, TriggerAxis_length)
TriggerAxis_dev = TriggerAxis_mult * TriggerAxis_stdev_value
TriggerAxis_bullish = TriggerAxis_basis + TriggerAxis_dev
TriggerAxis_bearish = TriggerAxis_basis - TriggerAxis_dev
is_bullish = TriggerAxis_price >= TriggerAxis_basis
is_bearish = TriggerAxis_price < TriggerAxis_basis
trend_strength = math.abs(TriggerAxis_price - TriggerAxis_basis) / (TriggerAxis_stdev_value * 0.5)
strong_trend = trend_strength > 1.5
TriggerAxis_bullish_color_ = TriggerAxis_enabled ? (is_bullish ? TriggerAxis_bullish_color : TriggerAxis_bullish_shadow_color) : na
TriggerAxis_bearish_color_ = TriggerAxis_enabled ? (is_bearish ? TriggerAxis_bearish_color : TriggerAxis_bearish_shadow_color) : na
TriggerAxis_color_bullish = ta.crossover(TriggerAxis_price, TriggerAxis_bullish)
TriggerAxis_color_bearish = ta.crossunder(TriggerAxis_price, TriggerAxis_bearish)

// (((((((((((((((((((((((((( Trail Zone Calculation ))))))))))))))))))))))))))

TrailAxis_alertDisplacement = 26
TrailAxis_lagging = 26 
TrailAxis_current = close 
TrailAxis_pricehistorical = close[TrailAxis_alertDisplacement-1] 
TrailAxis_color = unical_trailaxis > close[TrailAxis_lagging] ? TrailAxis_bullish : TrailAxis_bearish 
TrailAxis_x_Transition_Alpha_bullish = ta.crossover(TrailAxis_current, UniCal_transitionalpha_source[50]) 
TrailAxis_x_Transition_Alpha_bearish = ta.crossunder(TrailAxis_current, UniCal_transitionalpha_source[50]) 
TrailAxis_x_Transition_Omega_bullish = ta.crossover(TrailAxis_current, UniCal_transitionomega_source[50]) 
TrailAxis_x_Transition_Omega_bearish = ta.crossunder(TrailAxis_current, UniCal_transitionomega_source[50]) 
TrailZone_atr = ta.atr(TrailZone_atr_len) 
TrailZone_offset = TrailZone_atr * TrailZone_atr_mult 
TrailOmega = unical_trailaxis + TrailZone_offset 
TrailAlfa = unical_trailaxis - TrailZone_offset 

// (((((((((((((((((((((((((( Trial Zone Calculation ))))))))))))))))))))))))))

donchian_trialzone(len) => math.avg(ta.lowest(len), ta.highest(len))
trialzone_Conversion = donchian_trialzone(TrialZone_conversion)
trialzone_Base = donchian_trialzone(TrialZone_base)
TrialAlpha = math.avg(trialzone_Conversion, trialzone_Base)
TrialOmega = donchian_trialzone(TrialZone_displacement)
TrialAxis = math.avg(TrialAlpha, TrialOmega)
is_bullish_TrialZone = TrialAlpha > TrialOmega
is_bearish_TrialZone = TrialAlpha < TrialOmega
is_neutral_TrialZone = TrialAlpha == TrialOmega

// (((((((((((((((((((((((((( Transition Zone Calculation ))))))))))))))))))))))))))

donchian_transitionzone(len) => math.avg(ta.lowest(len), ta.highest(len))
transitionzone_Conversion = donchian_transitionzone(TransitionZone_conversion)
transitionzone_Base = donchian_transitionzone(TransitionZone_base)
TransitionAlpha = math.avg(transitionzone_Conversion, transitionzone_Base)
TransitionOmega = donchian_transitionzone(TransitionZone_displacement)
TransitionAxis = math.avg(TransitionAlpha, TransitionOmega)
is_bullish_TransitionZone = TransitionAlpha > TransitionOmega
is_bearish_TransitionZone = TransitionAlpha < TransitionOmega
is_neutral_TransitionZone = TransitionAlpha == TransitionOmega
candles_transitionomega_bull = ta.crossover(close, TransitionOmega[TransitionZone_lagging - 1])
candles_transitionomega_bear = ta.crossunder(close, TransitionOmega[TransitionZone_lagging - 1])

// (((((((((((((((((((((((((( Core Zone Calculation ))))))))))))))))))))))))))

CoreZone_Twist_bullish = ta.crossover(TrialAxis[0], TransitionAxis[TransitionZone_lagging - 1])
CoreZone_Twist_bearish = ta.crossunder(TrialAxis[0], TransitionAxis[TransitionZone_lagging - 1])
CoreAxis = math.avg(TrialAxis, TransitionAxis[TransitionZone_lagging - 1])
CoreAxis_color = TrialAxis > TransitionAxis[TransitionZone_lagging - 1] ? CoreAxis_bullish_color : CoreAxis_bearish_color 

// (((((((((((((((((((((((((( Helper Sources Functions ))))))))))))))))))))))))))

get_source() =>
    switch CCP_source_options
        "Close" => close
        "Open" => open
        "High" => high
        "Low" => low
        "HL2" => hl2
        "HLC3" => hlc3
        "OHLC4" => ohlc4
        "Trial Alpha" => UniCal_trialalpha_source
        "Trial Omega" => UniCal_trialomega_source
        "Trail Axis" => unical_trailaxis
        "Trial Alpha Source 2" => UniCal_trialalpha_source2
        "Trial Omega Source 2" => UniCal_trialomega_source2
        "Transition Alpha" => UniCal_transitionalpha_source
        "Transition Omega" => UniCal_transitionomega_source
        => close

src = get_source()

// (((((((((((((((((((((((((( Period Separator Functions ))))))))))))))))))))))))))

getLineStyle(string input) =>
    switch input
        "Solid"  => line.style_solid
        "Dashed" => line.style_dashed
        "Dotted" => line.style_dotted

drawPeriodSeparator(color color, string style, int width, string timeframe) =>
    if timeframe.change(timeframe)
        line.new(
             x1     = bar_index,
             x2     = bar_index,
             y1     = high + syminfo.mintick,
             y2     = low,
             extend = extend.both,
             color  = color,
             style  = getLineStyle(style),
             width  = width
             )

if PeriodSeparator_enable and timeframe.in_seconds(timeframe.period) <= timeframe.in_seconds(PeriodSeparator_timeframe)
    drawPeriodSeparator(PeriodSeparator_color, PeriodSeparator_style, PeriodSeparator_width, PeriodSeparator_timeframe)
    
// (((((((((((((((((((((((((( LTF Candle Projection Timeframe Calculation ))))))))))))))))))))))))))

getAutoTimeframeltf(s, m5, m15, m60, m240, m, d, w, q, y) =>
    timeframe.isseconds ? s :
     timeframe.isminutes ? 
      timeframe.multiplier < 5 ? m5 : 
      timeframe.multiplier < 15 ? m15 : 
      timeframe.multiplier < 60 ? m60 :
      timeframe.multiplier < 240 ? m240 : m :
     timeframe.isdaily ? d :
     timeframe.isweekly ? w :
     timeframe.ismonthly and timeframe.multiplier < 6 ? q : y

determineAutoTimeframeltf() =>
    if ltf_2lvs
        getAutoTimeframeltf('5', '15', '60', '240', '1D', '1W', '1M', '3M', '12M', '12M')
    else
        getAutoTimeframeltf('1', '5', '15', '60', '240', '1D', '1W', '1M', '3M', '12M')

getSizeMultiplierltf() =>
    result = switch ltfsize
        'Small' => 1
        'Medium' => 2
        'Large' => 3
    result

getLineStyleltf(style) =>
    result = switch style
        'Solid' => line.style_solid
        'Dotted' => line.style_dotted
        'Dashed' => line.style_dashed
    result

getLabelSizeltf(sizeStr) =>
    result = switch sizeStr
        'Auto' => size.auto
        'Tiny' => size.tiny
        'Small' => size.small
        'Normal' => size.normal
        'Large' => size.large
        'Huge' => size.huge
    result

var maxIndexltf = ltfnum - 1
var curr_tfltf = ltf_auto ? determineAutoTimeframeltf() : ltf
var useltfData = timeframe.isweekly and ltf_data == 'Weekly' or ltf_data == 'Always'
var sizeMultiplierltf = getSizeMultiplierltf()
newCandleltf = ta.change(time(curr_tfltf)) != 0
var anchor_barltf = 0

// (((((((((((((((((((((((((( HTF Candle Projection Timeframe Calculation ))))))))))))))))))))))))))

getAutoTimeframehtf(s, m5, m15, m60, m240, m, d, w, q, y) =>
    timeframe.isseconds ? s :
     timeframe.isminutes ? 
      timeframe.multiplier < 5 ? m5 : 
      timeframe.multiplier < 15 ? m15 : 
      timeframe.multiplier < 60 ? m60 :
      timeframe.multiplier < 240 ? m240 : m :
     timeframe.isdaily ? d :
     timeframe.isweekly ? w :
     timeframe.ismonthly and timeframe.multiplier < 6 ? q : y

determineAutoTimeframehtf() =>
    if htf_2lvs
        getAutoTimeframehtf('5', '15', '60', '240', '1D', '1W', '1M', '3M', '12M', '12M')
    else
        getAutoTimeframehtf('1', '5', '15', '60', '240', '1D', '1W', '1M', '3M', '12M')

getSizeMultiplierhtf() =>
    result = switch htfsize
        'Small' => 1
        'Medium' => 2
        'Large' => 3
    result

getLineStylehtf(style) =>
    result = switch style
        'Solid' => line.style_solid
        'Dotted' => line.style_dotted
        'Dashed' => line.style_dashed
    result

getLabelSizehtf(sizeStr) =>
    result = switch sizeStr
        'Auto' => size.auto
        'Tiny' => size.tiny
        'Small' => size.small
        'Normal' => size.normal
        'Large' => size.large
        'Huge' => size.huge
    result

var maxIndexhtf = htfnum - 1
var curr_tfhtf = htf_auto ? determineAutoTimeframehtf() : htf
var usehtfData = timeframe.isweekly and htf_data == 'Weekly' or htf_data == 'Always'
var sizeMultiplierhtf = getSizeMultiplierhtf()
newCandlehtf = ta.change(time(curr_tfhtf)) != 0
var anchor_barhtf = 0

// (((((((((((((((((((((((((( NC/LTF/HTF Candle Color Progression Unified Statements ))))))))))))))))))))))))))

price = ta.ema(src, CCP_ema_len)
basis = ta.sma(src, CCP_length)
stdev = ta.stdev(src, CCP_length)
zone1_upper = basis + CCP_zone1 * stdev
zone1_lower = basis - CCP_zone1 * stdev
zone2_upper = basis + CCP_zone2 * stdev
zone2_lower = basis - CCP_zone2 * stdev
zone3_upper = basis + CCP_zone3 * stdev
zone3_lower = basis - CCP_zone3 * stdev
zone4_upper = basis + CCP_zone4 * stdev
zone4_lower = basis - CCP_zone4 * stdev

// (((((((((((((((((((((((((( NC Normal Candle CCP Calculation ))))))))))))))))))))))))))

nc_basis = request.security(syminfo.tickerid, curr_tfltf, ta.sma(get_source(), CCP_length), lookahead = barmerge.lookahead_on)
nc_stdev = request.security(syminfo.tickerid, curr_tfltf, ta.stdev(get_source(), CCP_length), lookahead = barmerge.lookahead_on)
nc_zone1_upper = nc_basis + CCP_zone1 * nc_stdev
nc_zone1_lower = nc_basis - CCP_zone1 * nc_stdev
nc_zone2_upper = nc_basis + CCP_zone2 * nc_stdev
nc_zone2_lower = nc_basis - CCP_zone2 * nc_stdev
nc_zone3_upper = nc_basis + CCP_zone3 * nc_stdev
nc_zone3_lower = nc_basis - CCP_zone3 * nc_stdev
nc_zone4_upper = nc_basis + CCP_zone4 * nc_stdev
nc_zone4_lower = nc_basis - CCP_zone4 * nc_stdev

getCCPColor(candle_close, candle_open, use_nc_zone = false) =>
    candle_is_bull = candle_close >= candle_open
    candle_color = #001f73
    current_basis = use_nc_zone ? nc_basis : basis
    current_zone1_upper = use_nc_zone ? nc_zone1_upper : zone1_upper
    current_zone1_lower = use_nc_zone ? nc_zone1_lower : zone1_lower
    current_zone2_upper = use_nc_zone ? nc_zone2_upper : zone2_upper
    current_zone2_lower = use_nc_zone ? nc_zone2_lower : zone2_lower
    current_zone3_upper = use_nc_zone ? nc_zone3_upper : zone3_upper
    current_zone3_lower = use_nc_zone ? nc_zone3_lower : zone3_lower
    if not CCP_enable_candle_color
        candle_color := candle_is_bull ? #001f73 : #4c1015
    else
        if candle_close >= current_basis and candle_close <= current_zone1_upper
            candle_color := candle_is_bull ? candle_color_basis_zone1_upper_bull : candle_color_basis_zone1_upper_bear
        else if candle_close < current_basis and candle_close >= current_zone1_lower
            candle_color := candle_is_bull ? candle_color_basis_zone1_lower_bull : candle_color_basis_zone1_lower_bear
        else if candle_close > current_zone1_upper and candle_close <= current_zone2_upper
            candle_color := candle_is_bull ? candle_color_zone1_zone2_upper_bull : candle_color_zone1_zone2_upper_bear
        else if candle_close < current_zone1_lower and candle_close >= current_zone2_lower
            candle_color := candle_is_bull ? candle_color_zone1_zone2_lower_bull : candle_color_zone1_zone2_lower_bear
        else if candle_close > current_zone2_upper and candle_close <= current_zone3_upper
            candle_color := candle_is_bull ? candle_color_zone2_zone3_upper_bull : candle_color_zone2_zone3_upper_bear
        else if candle_close < current_zone2_lower and candle_close >= current_zone3_lower
            candle_color := candle_is_bull ? candle_color_zone2_zone3_lower_bull : candle_color_zone2_zone3_lower_bear
        else if candle_close > current_zone3_upper
            candle_color := candle_is_bull ? candle_color_zone3_zone4_upper_bull : candle_color_zone3_zone4_upper_bear
        else if candle_close < current_zone3_lower
            candle_color := candle_is_bull ? candle_color_zone3_zone4_lower_bull : candle_color_zone3_zone4_lower_bear
    candle_color

normal_candle_color = getCCPColor(close, open, false)
barcolor(CCP_enable_candle_color ? normal_candle_color : na)

// (((((((((((((((((((((((((( LTF Candle projection CCP Calculation ))))))))))))))))))))))))))

ltf_basis = request.security(syminfo.tickerid, curr_tfltf, ta.sma(get_source(), CCP_length), lookahead = barmerge.lookahead_on)
ltf_stdev = request.security(syminfo.tickerid, curr_tfltf, ta.stdev(get_source(), CCP_length), lookahead = barmerge.lookahead_on)
ltfc_closed = request.security(syminfo.tickerid, curr_tfltf, close[1], lookahead = barmerge.lookahead_off)
ltf_zone1_upper = ltf_basis + CCP_zone1 * ltf_stdev
ltf_zone1_lower = ltf_basis - CCP_zone1 * ltf_stdev
ltf_zone2_upper = ltf_basis + CCP_zone2 * ltf_stdev
ltf_zone2_lower = ltf_basis - CCP_zone2 * ltf_stdev
ltf_zone3_upper = ltf_basis + CCP_zone3 * ltf_stdev
ltf_zone3_lower = ltf_basis - CCP_zone3 * ltf_stdev
ltf_zone4_upper = ltf_basis + CCP_zone4 * ltf_stdev
ltf_zone4_lower = ltf_basis - CCP_zone4 * ltf_stdev

getCCPColorltf(candle_closeltf, candle_openltf, use_ltf_zone = false) =>
    candle_is_bullltf = candle_closeltf >= candle_openltf
    candle_colorltf = #001f73
    current_basisltf = use_ltf_zone ? ltf_basis : basis
    current_zone1_upperltf = use_ltf_zone ? ltf_zone1_upper : zone1_upper
    current_zone1_lowerltf = use_ltf_zone ? ltf_zone1_lower : zone1_lower
    current_zone2_upperltf = use_ltf_zone ? ltf_zone2_upper : zone2_upper
    current_zone2_lowerltf = use_ltf_zone ? ltf_zone2_lower : zone2_lower
    current_zone3_upperltf = use_ltf_zone ? ltf_zone3_upper : zone3_upper
    current_zone3_lowerltf = use_ltf_zone ? ltf_zone3_lower : zone3_lower
    if not CCP_enable_candle_color
        candle_colorltf := candle_is_bullltf ? #001f73 : #4c1015
    else
        if candle_closeltf >= current_basisltf and candle_closeltf <= current_zone1_upperltf
            candle_colorltf := candle_is_bullltf ? candle_color_basis_zone1_upper_bull : candle_color_basis_zone1_upper_bear
        else if candle_closeltf < current_basisltf and candle_closeltf >= current_zone1_lowerltf
            candle_colorltf := candle_is_bullltf ? candle_color_basis_zone1_lower_bull : candle_color_basis_zone1_lower_bear
        else if candle_closeltf > current_zone1_upperltf and candle_closeltf <= current_zone2_upperltf
            candle_colorltf := candle_is_bullltf ? candle_color_zone1_zone2_upper_bull : candle_color_zone1_zone2_upper_bear
        else if candle_closeltf < current_zone1_lowerltf and candle_closeltf >= current_zone2_lowerltf
            candle_colorltf := candle_is_bullltf ? candle_color_zone1_zone2_lower_bull : candle_color_zone1_zone2_lower_bear
        else if candle_closeltf > current_zone2_upperltf and candle_closeltf <= current_zone3_upperltf
            candle_colorltf := candle_is_bullltf ? candle_color_zone2_zone3_upper_bull : candle_color_zone2_zone3_upper_bear
        else if candle_closeltf < current_zone2_lowerltf and candle_closeltf >= current_zone3_lowerltf
            candle_colorltf := candle_is_bullltf ? candle_color_zone2_zone3_lower_bull : candle_color_zone2_zone3_lower_bear
        else if candle_closeltf > current_zone3_upperltf
            candle_colorltf := candle_is_bullltf ? candle_color_zone3_zone4_upper_bull : candle_color_zone3_zone4_upper_bear
        else if candle_closeltf < current_zone3_lowerltf
            candle_colorltf := candle_is_bullltf ? candle_color_zone3_zone4_lower_bull : candle_color_zone3_zone4_lower_bear
    candle_colorltf

// (((((((((((((((((((((((((( HTF Candle projection CCP Calculation ))))))))))))))))))))))))))

htf_basis = request.security(syminfo.tickerid, curr_tfhtf, ta.sma(get_source(), CCP_length), lookahead = barmerge.lookahead_on)
htf_stdev = request.security(syminfo.tickerid, curr_tfhtf, ta.stdev(get_source(), CCP_length), lookahead = barmerge.lookahead_on)
htfc_closed = request.security(syminfo.tickerid, curr_tfhtf, close[1], lookahead = barmerge.lookahead_off)
htf_zone1_upper = htf_basis + CCP_zone1 * htf_stdev
htf_zone1_lower = htf_basis - CCP_zone1 * htf_stdev
htf_zone2_upper = htf_basis + CCP_zone2 * htf_stdev
htf_zone2_lower = htf_basis - CCP_zone2 * htf_stdev
htf_zone3_upper = htf_basis + CCP_zone3 * htf_stdev
htf_zone3_lower = htf_basis - CCP_zone3 * htf_stdev
htf_zone4_upper = htf_basis + CCP_zone4 * htf_stdev
htf_zone4_lower = htf_basis - CCP_zone4 * htf_stdev

getCCPColorhtf(candle_closehtf, candle_openhtf, use_htf_zone = false) =>
    candle_is_bullhtf = candle_closehtf >= candle_openhtf
    candle_colorhtf = #001f73
    current_basishtf = use_htf_zone ? htf_basis : basis
    current_zone1_upperhtf = use_htf_zone ? htf_zone1_upper : zone1_upper
    current_zone1_lowerhtf = use_htf_zone ? htf_zone1_lower : zone1_lower
    current_zone2_upperhtf = use_htf_zone ? htf_zone2_upper : zone2_upper
    current_zone2_lowerhtf = use_htf_zone ? htf_zone2_lower : zone2_lower
    current_zone3_upperhtf = use_htf_zone ? htf_zone3_upper : zone3_upper
    current_zone3_lowerhtf = use_htf_zone ? htf_zone3_lower : zone3_lower
    if not CCP_enable_candle_color
        candle_colorhtf := candle_is_bullhtf ? #001f73 : #4c1015
    else
        if candle_closehtf >= current_basishtf and candle_closehtf <= current_zone1_upperhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_basis_zone1_upper_bull : candle_color_basis_zone1_upper_bear
        else if candle_closehtf < current_basishtf and candle_closehtf >= current_zone1_lowerhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_basis_zone1_lower_bull : candle_color_basis_zone1_lower_bear
        else if candle_closehtf > current_zone1_upperhtf and candle_closehtf <= current_zone2_upperhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_zone1_zone2_upper_bull : candle_color_zone1_zone2_upper_bear
        else if candle_closehtf < current_zone1_lowerhtf and candle_closehtf >= current_zone2_lowerhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_zone1_zone2_lower_bull : candle_color_zone1_zone2_lower_bear
        else if candle_closehtf > current_zone2_upperhtf and candle_closehtf <= current_zone3_upperhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_zone2_zone3_upper_bull : candle_color_zone2_zone3_upper_bear
        else if candle_closehtf < current_zone2_lowerhtf and candle_closehtf >= current_zone3_lowerhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_zone2_zone3_lower_bull : candle_color_zone2_zone3_lower_bear
        else if candle_closehtf > current_zone3_upperhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_zone3_zone4_upper_bull : candle_color_zone3_zone4_upper_bear
        else if candle_closehtf < current_zone3_lowerhtf
            candle_colorhtf := candle_is_bullhtf ? candle_color_zone3_zone4_lower_bull : candle_color_zone3_zone4_lower_bear
    candle_colorhtf

// (((((((((((((((((((((((((( State Control Variables ))))))))))))))))))))))))))

var int signal_state_trailaxis_candles = 0
var int signal_state_trailaxis_transitionalpha = 0
var int signal_state_trailaxis_transitionomega = 0
var int signal_state_corezonetwist = 0
var int signal_state_candles_transitionomega = 0
var int signal_state_triggeraxis = 0
var int signal_state_TrialZone = 0
var int signal_state_TransitionZone = 0

var int last_state_transitionzone = 0
var int last_state_trailaxis_transitionomega = 0
var int last_state_trailaxis_transitionalpha = 0
var int last_state_trailaxis_candles = 0

var string lasttrailaxisState = na
var string lasttrailaxisXtransitionomegaState = na
var string lastconvergenceState = na
var string lastcandleprogressionState = na
var string lastcorezonetwistState = na
var string lastCandlesTransitionOmegaState = na

// (((((((((((((((((((((((((( Trail Axis x Candles Signals ))))))))))))))))))))))))))

if TrailAxis_current > TrailAxis_pricehistorical
    signal_state_trailaxis_candles := 1
else if TrailAxis_current < TrailAxis_pricehistorical
    signal_state_trailaxis_candles := -1

// (((((((((((((((((((((((((( Trigger Axis Signals ))))))))))))))))))))))))))

if TriggerAxis_color_bullish
    signal_state_triggeraxis := 1
else if TriggerAxis_color_bearish
    signal_state_triggeraxis := -1
else if TriggerAxis_price < TriggerAxis_bullish and TriggerAxis_price > TriggerAxis_bearish
    signal_state_triggeraxis := 0
    
// (((((((((((((((((((((((((( Trail Axis x Transition Alpha Signals ))))))))))))))))))))))))))

if TrailAxis_x_Transition_Alpha_bullish
    signal_state_trailaxis_transitionalpha := 1
else if TrailAxis_x_Transition_Alpha_bearish
    signal_state_trailaxis_transitionalpha := -1

// (((((((((((((((((((((((((( Trail Axis x Transition Omega Signals ))))))))))))))))))))))))))

if TrailAxis_x_Transition_Omega_bullish
    signal_state_trailaxis_transitionomega := 1
else if TrailAxis_x_Transition_Omega_bearish
    signal_state_trailaxis_transitionomega := -1
    
// (((((((((((((((((((((((((( Candles x Transition Omega Signals ))))))))))))))))))))))))))

if candles_transitionomega_bull
    signal_state_candles_transitionomega := 1
else if candles_transitionomega_bear
    signal_state_candles_transitionomega := -1

// (((((((((((((((((((((((((( Trial Zone Signals ))))))))))))))))))))))))))

if is_bullish_TrialZone
    signal_state_TrialZone := 1
else if is_bearish_TrialZone
    signal_state_TrialZone := -1
else if is_neutral_TrialZone
    signal_state_TrialZone := 0
    
// (((((((((((((((((((((((((( Core Zone Twist Signals )))))))))))))))))))))))))) 

if CoreZone_Twist_bullish
    signal_state_corezonetwist := 1
else if CoreZone_Twist_bearish
    signal_state_corezonetwist := -1

// (((((((((((((((((((((((((( Transition Zone Signals ))))))))))))))))))))))))))

if is_bullish_TransitionZone
    signal_state_TransitionZone := 1
else if is_bearish_TransitionZone
    signal_state_TransitionZone := -1
else if is_neutral_TransitionZone
    signal_state_TransitionZone := 0

// (((((((((((((((((((((((((( Candle Color Progression Alerts Logic )))))))))))))))))))))))))) 

CCP_Z2Z3_bullish = CCP_enable_candle_color and close >= open and close > zone2_upper and close <= zone3_upper
CCP_Z2Z3_bearish = CCP_enable_candle_color and close < open and close < zone2_lower and close >= zone3_lower
CCP_Z2Z3_any = CCP_Z2Z3_bullish or CCP_Z2Z3_bearish
CCP_Z3Z4_bullish = CCP_enable_candle_color and close >= open and close > zone3_upper and close <= zone4_upper
CCP_Z3Z4_bearish = CCP_enable_candle_color and close < open and close < zone3_lower and close >= zone4_lower
CCP_Z3Z4_any = CCP_Z3Z4_bullish or CCP_Z3Z4_bearish
CandleProgression = CCP_Z2Z3_any or CCP_Z3Z4_any

currentCandleProgressionState = 
     CCP_Z2Z3_bullish ? "BullZ2Z3" :
     CCP_Z2Z3_bearish ? "BearZ2Z3" :
     CCP_Z3Z4_bullish ? "BullZ3Z4" :
     CCP_Z3Z4_bearish ? "BearZ3Z4" :
     lastcandleprogressionState

candleProgressionChanged = currentCandleProgressionState != lastcandleprogressionState and not na(currentCandleProgressionState)

if candleProgressionChanged
    lastcandleprogressionState := currentCandleProgressionState

CandleProgressionSignal = candleProgressionChanged

// (((((((((((((((((((((((((( Trail Axis X Candles Alerts Logic ))))))))))))))))))))))))))

currenttrailaxisState = signal_state_trailaxis_candles == 1 ? "Upper" : signal_state_trailaxis_candles == -1 ? "Lower" : lasttrailaxisState
trailaxisStateChanged = currenttrailaxisState != lasttrailaxisState and not na(currenttrailaxisState)
TrailAxisCandlesCrossing_bullish = trailaxisStateChanged and currenttrailaxisState == "Upper"
TrailAxisCandlesCrossing_bearish = trailaxisStateChanged and currenttrailaxisState == "Lower"
TrailAxisCandlesCrossing = TrailAxisCandlesCrossing_bullish or TrailAxisCandlesCrossing_bearish

if trailaxisStateChanged
    lasttrailaxisState := currenttrailaxisState

// (((((((((((((((((((((((((( Trail Axis X Transition Omega Alerts Logic ))))))))))))))))))))))))))

currenttrailaxisXtransitionomegaState = signal_state_trailaxis_transitionomega == 1 ? "Upper" : signal_state_trailaxis_transitionomega == -1 ? "Lower" : lasttrailaxisXtransitionomegaState
TrailaxisXtransitionomegaStateChanged = currenttrailaxisXtransitionomegaState != lasttrailaxisXtransitionomegaState and not na(currenttrailaxisXtransitionomegaState)

if TrailaxisXtransitionomegaStateChanged
    lasttrailaxisXtransitionomegaState := currenttrailaxisXtransitionomegaState

TrailaxisXtransitionomega_bullish = TrailaxisXtransitionomegaStateChanged and currenttrailaxisXtransitionomegaState == "Upper"
TrailaxisXtransitionomega_bearish = TrailaxisXtransitionomegaStateChanged and currenttrailaxisXtransitionomegaState == "Lower"
TrailaxisTransitionOmegaCrossing = TrailaxisXtransitionomega_bullish or TrailaxisXtransitionomega_bearish    

// (((((((((((((((((((((((((( Candles X Transition Omega Alerts Logic ))))))))))))))))))))))))))

currentCandlesTransitionOmegaState = signal_state_candles_transitionomega == 1 ? "Upper" : signal_state_candles_transitionomega == -1 ? "Lower" : lastCandlesTransitionOmegaState
CandlesTransitionOmegaStateChanged = currentCandlesTransitionOmegaState != lastCandlesTransitionOmegaState and not na(currentCandlesTransitionOmegaState)

if CandlesTransitionOmegaStateChanged
    lastCandlesTransitionOmegaState := currentCandlesTransitionOmegaState

CandlesTransitionOmega_bullish = CandlesTransitionOmegaStateChanged and currentCandlesTransitionOmegaState == "Upper"
CandlesTransitionOmega_bearish = CandlesTransitionOmegaStateChanged and currentCandlesTransitionOmegaState == "Lower"
CandlesTransitionOmegaCrossing = CandlesTransitionOmega_bullish or CandlesTransitionOmega_bearish

// (((((((((((((((((((((((((( Core Zone Twist Alerts Logic ))))))))))))))))))))))))))

currentCoreZone_TwistState = signal_state_corezonetwist == 1 ? "Upper" : signal_state_corezonetwist == -1 ? "Lower" : lastcorezonetwistState
CoreZone_TwistStateChanged = currentCoreZone_TwistState != lastcorezonetwistState and not na(currentCoreZone_TwistState)

if CoreZone_TwistStateChanged
    lastcorezonetwistState := currentCoreZone_TwistState

CoreZoneTwist_bullish = CoreZone_TwistStateChanged and currentCoreZone_TwistState == "Upper"
CoreZoneTwist_bearish = CoreZone_TwistStateChanged and currentCoreZone_TwistState == "Lower"
CoreZoneTwist = CoreZoneTwist_bullish or CoreZoneTwist_bearish

// (((((((((((((((((((((((((( Convergence Alerts Logic ))))))))))))))))))))))))))

transitionzone_changed = signal_state_TransitionZone != last_state_transitionzone and signal_state_TransitionZone != 0
trailaxis_transitionomega_changed = signal_state_trailaxis_transitionomega != last_state_trailaxis_transitionomega and signal_state_trailaxis_transitionomega != 0
trailaxis_transitionalfa_changed = signal_state_trailaxis_transitionalpha != last_state_trailaxis_transitionalpha and signal_state_trailaxis_transitionalpha != 0
trailaxis_candles_changed = signal_state_trailaxis_candles != last_state_trailaxis_candles and signal_state_trailaxis_candles != 0

if transitionzone_changed
    last_state_transitionzone := signal_state_TransitionZone
if trailaxis_transitionomega_changed
    last_state_trailaxis_transitionomega := signal_state_trailaxis_transitionomega
if trailaxis_transitionalfa_changed
    last_state_trailaxis_transitionalpha := signal_state_trailaxis_transitionalpha
if trailaxis_candles_changed
    last_state_trailaxis_candles := signal_state_trailaxis_candles

Convergence_upper = (signal_state_TransitionZone == 1) and (signal_state_candles_transitionomega == 1) and (signal_state_trailaxis_transitionomega == 1) and (signal_state_trailaxis_transitionalpha == 1) and (signal_state_trailaxis_candles == 1)
Convergence_lower = (signal_state_TransitionZone == -1) and (signal_state_candles_transitionomega == -1) and (signal_state_trailaxis_transitionomega == -1) and (signal_state_trailaxis_transitionalpha == -1) and (signal_state_trailaxis_candles == -1)
currentConvergenceState = Convergence_upper ? "Upper" : Convergence_lower ? "Lower" : lastconvergenceState
ConvergenceChanged = currentConvergenceState != lastconvergenceState and not na(currentConvergenceState)

if ConvergenceChanged
    lastconvergenceState := currentConvergenceState

Convergence_Bullish = ConvergenceChanged and currentConvergenceState == "Upper"
Convergence_Bearish = ConvergenceChanged and currentConvergenceState == "Lower"
Convergence = Convergence_Bullish or Convergence_Bearish

// (((((((((((((((((((((((((( Plots Lines/Fills ))))))))))))))))))))))))))

trailAlfa = plot(TrailZone_enabled ? TrailAlfa : na, offset = -TrailAxis_lagging + 1, color = TrailAxis_color, title = "Trail Alfa")
plot(TrailAxis_enabled ? unical_trailaxis : na, offset = -TrailAxis_lagging + 1, color = TrailAxis_color, linewidth = TrailAxis_width, title = "Trail Axis")
trailOmega = plot(TrailZone_enabled ? TrailOmega : na, offset = -TrailAxis_lagging + 1, color = TrailAxis_color, title = "Trail Omega")
fillColorTrailZone = TrailZone_enabled ? (TrailOmega > TrailAlfa ? color.new(TrailAxis_color, TrailZone_transp) : TrailOmega < TrailAlfa ? color.new(TrailAxis_color, TrailZone_transp) : color.new(TrailAxis_color, TrailZone_transp)) : na
fill(trailOmega, trailAlfa, color = fillColorTrailZone)
trialalpha = plot(TrialAlpha, offset=TrialZone_Lagging - 1, color = TrialAlpha > TrialOmega ? color.new(TrialZone_bullish, 0) : color.new(TrialZone_bearish, 0), title="Trial Alpha", display=TrialZone_enable ? display.all : display.none)
trialaxis = plot(TrialAxis_enabled ? TrialAxis : na, offset = TrialZone_Lagging - 1, color = TrialAlpha > TrialOmega ? color.new(TrialZone_bullish, 0) : color.new(TrialZone_bearish, 0), linewidth = TrialAxis_width, title = "Trial Axis")
trialomega = plot(TrialOmega, offset=TrialZone_Lagging - 1, color = TrialAlpha > TrialOmega ? color.new(TrialZone_bullish, 0) : color.new(TrialZone_bearish, 0), title="Trial Omega", display=TrialZone_enable ? display.all : display.none)
transitionalpha = plot(TransitionAlpha, offset=TransitionZone_lagging - 1, color = TransitionAlpha > TransitionOmega ? color.new(TransitionZone_bullish, 0) : color.new(TransitionZone_bearish, 0), title="Transition Alpha", display=TransitionZone_enable ? display.all : display.none)
transitionaxis = plot(TransitionAxis_enabled ? TransitionAxis : na, offset = TransitionZone_lagging - 1, color = TransitionAlpha > TransitionOmega ? color.new(TransitionZone_bullish, 0) : color.new(TransitionZone_bearish, 0), linewidth = TransitionAxis_width, title = "Transition Axis")
transitionomega = plot(TransitionOmega, offset=TransitionZone_lagging - 1, color = TransitionAlpha > TransitionOmega ? color.new(TransitionZone_bullish, 0) : color.new(TransitionZone_bearish, 0), title="Transition Omega", display=TransitionZone_enable ? display.all : display.none)
fillColorTrialZone = TrialZone_enable ? (TrialAlpha > TrialOmega ? color.new(TrialZone_bullish, TrialZone_transp) : color.new(TrialZone_bearish, TrialZone_transp)) : na
fill(trialalpha, trialomega, color=fillColorTrialZone)
plot(CoreAxis_enabled ? CoreAxis : na, title="Core Axis", color=CoreAxis_color, linewidth=CoreAxis_width)
fillcolorcorezone = CoreZone_enable ? (TrialAxis > TransitionAxis[TransitionZone_lagging - 1] ? CoreZone_bullish_fill : CoreZone_bearish_fill) : na
fill(trialaxis, transitionaxis, color = fillcolorcorezone)
fillColorTransitionZone = TransitionZone_enable ? (TransitionAlpha > TransitionOmega ? color.new(TransitionZone_bullish, TransitionZone_transp) : color.new(TransitionZone_bearish, TransitionZone_transp)) : na
fill(transitionalpha, transitionomega, color=fillColorTransitionZone)
plot_triggeraxi_bullish = plot(TriggerAxis_enabled ? TriggerAxis_bullish : na, color=TriggerAxis_bullish_color_, title="Trigger Axis Bullish", linewidth=TriggerAxis_width)
plot_triggeraxi_bearish = plot(TriggerAxis_enabled ? TriggerAxis_bearish : na, color=TriggerAxis_bearish_color_, title="Trigger Axis Bearish", linewidth=TriggerAxis_width)

// (((((((((((((((((((((((((( Plots Signals ))))))))))))))))))))))))))

plotchar(volBullish, title="Bullish Volume Signal", char=Vol_bullsih_signal, location=location.bottom, color=Vol_bullsih_color, size=size.small)
plotchar(volBearish, title="Bearish Volume Signal", char=Vol_bearish_signal, location=location.bottom, color=Vol_bearish_color, size=size.small)
plotchar(CoreZone_Twist_bullish, "Core Zone Twist Bullish", "⏺", location.bottom, #ffffff, size=size.small)
plotchar(CoreZone_Twist_bearish, "Core Zone Twist Bearish", "⏺", location.bottom, #000000, size=size.small)    
plotchar(TransitionZone_enable_signals and signal_state_TransitionZone == 1, title="Transition Zone Bullish Signal", char="⦁", location=location.bottom, color=TransitionZone_bullish_signal_color, size=size.small)
plotchar(TransitionZone_enable_signals and signal_state_TransitionZone == -1, title="Transition Zone Bearish Signal", char="⦁", location=location.bottom, color=TransitionZone_bearish_signal_color, size=size.small)
plotchar(TransitionZone_enable_signals and signal_state_TransitionZone == 0, title="Transition Zone Neutral Signal", char="⦁", location=location.bottom, color=TransitionZone_neutral_signal_color, size=size.small)
plotchar(TriggerAxis_enable_signals and signal_state_triggeraxis == 1, "Trigger Axis Bullish Signal", "∙", location.bottom, #ffffff, size=size.small)
plotchar(TriggerAxis_enable_signals and signal_state_triggeraxis == -1, "Trigger Axis Bearish Signal", "∙", location.bottom, #000000, size=size.small)
plotchar(TriggerAxis_enable_signals and signal_state_triggeraxis == 0, "Trigger Axis Neutral Signal", "∙", location.bottom, #b8b8b8, size=size.small)
plotchar(Candles_TransitionOmega_crossing_signal_enabled and signal_state_candles_transitionomega == 1, title="Candles x Transition Omega Bullish Signal", char="⎺", location=location.bottom, color=Candles_transitionomega_crossing_bullish, size=size.tiny)
plotchar(Candles_TransitionOmega_crossing_signal_enabled and signal_state_candles_transitionomega == -1, title="Candles x Transition Omega Bearish Signal", char="⎺", location=location.bottom, color=Candles_TransitionOmega_crossing_bearish, size=size.tiny)
plotchar(TrailAxis_enable_Signals and signal_state_trailaxis_transitionomega == 1, title="Trail Axis x Transition Omega Bullish Signal", char="⎻", location=location.bottom, color=TrailAxis_transition_omega_crossing_bullish, size=size.tiny)
plotchar(TrailAxis_enable_Signals and signal_state_trailaxis_transitionomega == -1, title="Trail Axis x Transition Omega Bearish Signal", char="⎻", location=location.bottom, color=TrailAxis_transition_omega_crossing_bearish, size=size.tiny)
plotchar(TrailAxis_enable_Signals and signal_state_trailaxis_transitionalpha == 1, title="Trail Axis x Transition Alfa Bullish Signal", char="⎼", location=location.bottom, color=TrailAxis_transition_alpha_crossing_bullish, size=size.tiny)
plotchar(TrailAxis_enable_Signals and signal_state_trailaxis_transitionalpha == -1, title="Trail Axis x Transition Alfa Bearish Signal", char="⎼", location=location.bottom, color=TrailAxis_transition_alpha_crossing_bearish, size=size.tiny)
plotchar(TrailAxis_enable_Signals and signal_state_trailaxis_candles == 1, title="Trail Axis x Candles Bullish Signal", char="⎽", location=location.bottom, color=TrailAxis_candles_crossing_bullish, size=size.tiny)
plotchar(TrailAxis_enable_Signals and signal_state_trailaxis_candles == -1, title="Trail Axis x Candles Bearish Signal", char="⎽", location=location.bottom, color=TrailAxis_candles_crossing_bearish, size=size.tiny)

// (((((((((((((((((((((((((( LTF Candle Projection Function ))))))))))))))))))))))))))

type Candleltf
	box bodyltf
	line upperWickltf
	line lowerWickltf
	line oltf
	line hltf
	line lltf
    line cltf
	label labelOltf
	label labelHltf
	label labelLltf
	label labelCltf
    // Retracement labels LTF
    label labelRetMaxltf
    label labelRet67ltf
    label labelRet50ltf
    label labelRet33ltf
    label labelRetMinltf
    // Retracement zones LTF
    box zoneBox1ltf
    box zoneBox2ltf
    box zoneBox3ltf
    box zoneBox4ltf
    // Retracement lines LTF
    line lineRetMaxltf
    line lineRet67ltf
    line lineRet50ltf
    line lineRet33ltf
    line lineRetMinltf

ohlcltf() =>
    [ltf_o, ltf_h, ltf_l, ltf_c] = request.security(syminfo.tickerid, curr_tfltf, [open, high, low, close], lookahead = barmerge.lookahead_off)

    var oltf = 0.
    var hltf = 0.
    var lltf = 0.
    cltf = close

    if newCandleltf
        oltf := open
        hltf := high
        lltf := low
        lltf
    else
        hltf := math.max(high, hltf)
        lltf := math.min(low, lltf)
        lltf

    [oltf, hltf, lltf, cltf, ltf_o, ltf_h, ltf_l, ltf_c]

// (((((((((((((((((((((((((( LTF Retracement Calculation Closed Candle ))))))))))))))))))))))))))

getRetracementPricesltf() =>
    [closed_highltf, closed_lowltf] = request.security(syminfo.tickerid, curr_tfltf, [high[1], low[1]], lookahead = barmerge.lookahead_off)
    candle_rangeltf = closed_highltf - closed_lowltf
    price_maxltf = closed_highltf
    price_67ltf = closed_lowltf + (candle_rangeltf * 0.6667)
    price_50ltf = closed_lowltf + (candle_rangeltf * 0.5)
    price_33ltf = closed_lowltf + (candle_rangeltf * 0.3333)
    price_minltf = closed_lowltf
    [price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf]

getCandlePostionltf(l_posltf) =>
    m_posltf = l_posltf + sizeMultiplierltf
    r_posltf = l_posltf + sizeMultiplierltf * 2
    [m_posltf, r_posltf]

createLabelltf(r_posltf, s, labelColor, labelSize) =>
    label.new(r_posltf, s, str.tostring(s, format.mintick), style = label.style_label_left, color = color.new(color.black, 100), textcolor = labelColor, size = labelSize)

createLabelsltf(Candleltf candle, oltf, hltf, lltf, cltf, l_posltf, labelColor, labelSize) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    candle.labelOltf := createLabelltf(r_posltf, oltf, labelColor, labelSize)
    candle.labelHltf := createLabelltf(r_posltf, hltf, labelColor, labelSize)
    candle.labelLltf := createLabelltf(r_posltf, lltf, labelColor, labelSize)
    candle.labelCltf := createLabelltf(r_posltf, cltf, labelColor, labelSize)
    candle.labelCltf

// (((((((((((((((((((((((((( LTF Retracement Labels Creation ))))))))))))))))))))))))))

createRetracementLabelsltf(Candleltf candle, l_posltf, price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    if ltfret_enabled
        if ltfret_max_enabled
            candle.labelRetMaxltf := createLabelltf(r_posltf, price_maxltf, ltfret_max_col, getLabelSizeltf(ltfret_max_size))
        if ltfret_67_enabled
            candle.labelRet67ltf := createLabelltf(r_posltf, price_67ltf, ltfret_67_col, getLabelSizeltf(ltfret_67_size))
        if ltfret_50_enabled
            candle.labelRet50ltf := createLabelltf(r_posltf, price_50ltf, ltfret_50_col, getLabelSizeltf(ltfret_50_size))
        if ltfret_33_enabled
            candle.labelRet33ltf := createLabelltf(r_posltf, price_33ltf, ltfret_33_col, getLabelSizeltf(ltfret_33_size))
        if ltfret_min_enabled
            candle.labelRetMinltf := createLabelltf(r_posltf, price_minltf, ltfret_min_col, getLabelSizeltf(ltfret_min_size))

// (((((((((((((((((((((((((( LTF Retracement Zones Creation ))))))))))))))))))))))))))

createRetracementZonesltf(Candleltf candle, l_posltf, price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf) =>
    if ltfzones_enabled
        [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
        // Calculate the final position of the second current candle LTF
        second_candle_l_posltf = bar_index + ltfoffset + maxIndexltf * (ltfmargin + 2 * sizeMultiplierltf)
        [_, second_candle_r_posltf] = getCandlePostionltf(second_candle_l_posltf)
        // Use the position of the second candle when it does not extend LTF
        right_posltf = ltfzones_extend ? bar_index + 500 : second_candle_r_posltf
        
        candle.zoneBox1ltf := box.new(l_posltf, price_maxltf, right_posltf, price_67ltf, border_color = color.new(ltfzone1_col, 100), bgcolor = ltfzone1_col)
        candle.zoneBox2ltf := box.new(l_posltf, price_67ltf, right_posltf, price_50ltf, border_color = color.new(ltfzone2_col, 100), bgcolor = ltfzone2_col)
        candle.zoneBox3ltf := box.new(l_posltf, price_50ltf, right_posltf, price_33ltf, border_color = color.new(ltfzone3_col, 100), bgcolor = ltfzone3_col)
        candle.zoneBox4ltf := box.new(l_posltf, price_33ltf, right_posltf, price_minltf, border_color = color.new(ltfzone4_col, 100), bgcolor = ltfzone4_col)

// (((((((((((((((((((((((((( LTF Retracement Lines Creation ))))))))))))))))))))))))))

createRetracementLinesltf(Candleltf candle, l_posltf, price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf) =>
    if ltflines_enabled
        [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
        // Calculate the final position of the second current candle LTF
        second_candle_l_posltf = bar_index + ltfoffset + maxIndexltf * (ltfmargin + 2 * sizeMultiplierltf)
        [_, second_candle_r_posltf] = getCandlePostionltf(second_candle_l_posltf)
        // Use the position of the second candle when it does not extend LTF
        right_posltf = ltflines_extend ? bar_index + 500 : second_candle_r_posltf
        
        if ltfline_max_enabled
            candle.lineRetMaxltf := line.new(l_posltf, price_maxltf, right_posltf, price_maxltf, color = ltfline_max_col, style = getLineStyleltf(ltfline_max_style), width = ltfline_max_width)
        if ltfline_67_enabled
            candle.lineRet67ltf := line.new(l_posltf, price_67ltf, right_posltf, price_67ltf, color = ltfline_67_col, style = getLineStyleltf(ltfline_67_style), width = ltfline_67_width)
        if ltfline_50_enabled
            candle.lineRet50ltf := line.new(bar_index + 1, price_50ltf, right_posltf, price_50ltf, color = ltfline_50_col, style = getLineStyleltf(ltfline_50_style), width = ltfline_50_width)
        if ltfline_33_enabled
            candle.lineRet33ltf := line.new(l_posltf, price_33ltf, right_posltf, price_33ltf, color = ltfline_33_col, style = getLineStyleltf(ltfline_33_style), width = ltfline_33_width)
        if ltfline_min_enabled
            candle.lineRetMinltf := line.new(l_posltf, price_minltf, right_posltf, price_minltf, color = ltfline_min_col, style = getLineStyleltf(ltfline_min_style), width = ltfline_min_width)

moveLabelltf(label la, r_posltf, s) =>
    la.set_text(str.tostring(s, format.mintick))
    la.set_xy(r_posltf, s)

moveLabelsltf(Candleltf candle, l_posltf, oltf, hltf, lltf, cltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    moveLabelltf(candle.labelOltf, r_posltf, oltf)
    moveLabelltf(candle.labelHltf, r_posltf, hltf)
    moveLabelltf(candle.labelLltf, r_posltf, lltf)
    moveLabelltf(candle.labelCltf, r_posltf, cltf)

// (((((((((((((((((((((((((( LTF Retracement Labels Movement ))))))))))))))))))))))))))

moveRetracementLabelsltf(Candleltf candle, l_posltf, price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    if not na(candle.labelRetMaxltf)
        moveLabelltf(candle.labelRetMaxltf, r_posltf, price_maxltf)
    if not na(candle.labelRet67ltf)
        moveLabelltf(candle.labelRet67ltf, r_posltf, price_67ltf)
    if not na(candle.labelRet50ltf)
        moveLabelltf(candle.labelRet50ltf, r_posltf, price_50ltf)
    if not na(candle.labelRet33ltf)
        moveLabelltf(candle.labelRet33ltf, r_posltf, price_33ltf)
    if not na(candle.labelRetMinltf)
        moveLabelltf(candle.labelRetMinltf, r_posltf, price_minltf)

// (((((((((((((((((((((((((( LTF Retracement Zones Movement ))))))))))))))))))))))))))

moveRetracementZonesltf(Candleltf candle, l_posltf, price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf) =>
    if ltfzones_enabled and not na(candle.zoneBox1ltf)
        [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
        // Calculate the final position of the second current candle LTF
        second_candle_l_posltf = bar_index + ltfoffset + maxIndexltf * (ltfmargin + 2 * sizeMultiplierltf)
        [_, second_candle_r_posltf] = getCandlePostionltf(second_candle_l_posltf)
        // Use the position of the second candle when it does not extend LTF
        right_posltf = ltfzones_extend ? bar_index + 500 : second_candle_r_posltf
        
        candle.zoneBox1ltf.set_lefttop(l_posltf, price_maxltf)
        candle.zoneBox1ltf.set_rightbottom(right_posltf, price_67ltf)
        
        candle.zoneBox2ltf.set_lefttop(l_posltf, price_67ltf)
        candle.zoneBox2ltf.set_rightbottom(right_posltf, price_50ltf)
        
        candle.zoneBox3ltf.set_lefttop(l_posltf, price_50ltf)
        candle.zoneBox3ltf.set_rightbottom(right_posltf, price_33ltf)
        
        candle.zoneBox4ltf.set_lefttop(l_posltf, price_33ltf)
        candle.zoneBox4ltf.set_rightbottom(right_posltf, price_minltf)

// (((((((((((((((((((((((((( LTF Retracement Lines Movement ))))))))))))))))))))))))))

moveRetracementLinesltf(Candleltf candle, l_posltf, price_maxltf, price_67ltf, price_50ltf, price_33ltf, price_minltf) =>
    if ltflines_enabled
        [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
        // Calculate the final position of the second current candle LTF
        second_candle_l_posltf = bar_index + ltfoffset + maxIndexltf * (ltfmargin + 2 * sizeMultiplierltf)
        [_, second_candle_r_posltf] = getCandlePostionltf(second_candle_l_posltf)
        // Use the position of the second candle when it does not extend LTF
        right_posltf = ltflines_extend ? bar_index + 500 : second_candle_r_posltf
        
        if not na(candle.lineRetMaxltf)
            candle.lineRetMaxltf.set_xy1(l_posltf, price_maxltf)
            candle.lineRetMaxltf.set_xy2(right_posltf, price_maxltf)
        if not na(candle.lineRet67ltf)
            candle.lineRet67ltf.set_xy1(l_posltf, price_67ltf)
            candle.lineRet67ltf.set_xy2(right_posltf, price_67ltf)
        if not na(candle.lineRet50ltf)
            candle.lineRet50ltf.set_xy1(bar_index + 1, price_50ltf)
            candle.lineRet50ltf.set_xy2(right_posltf, price_50ltf)
        if not na(candle.lineRet33ltf)
            candle.lineRet33ltf.set_xy1(l_posltf, price_33ltf)
            candle.lineRet33ltf.set_xy2(right_posltf, price_33ltf)
        if not na(candle.lineRetMinltf)
            candle.lineRetMinltf.set_xy1(l_posltf, price_minltf)
            candle.lineRetMinltf.set_xy2(right_posltf, price_minltf)

deleteLabelsltf(Candleltf candle) =>
    if not na(candle.labelOltf)
        candle.labelOltf.delete()
    if not na(candle.labelHltf)
        candle.labelHltf.delete()
    if not na(candle.labelLltf)
        candle.labelLltf.delete()
    if not na(candle.labelCltf)
        candle.labelCltf.delete()

// (((((((((((((((((((((((((( LTF Retracement Labels Delete ))))))))))))))))))))))))))

deleteRetracementLabelsltf(Candleltf candle) =>
    if not na(candle.labelRetMaxltf)
        candle.labelRetMaxltf.delete()
    if not na(candle.labelRet67ltf)
        candle.labelRet67ltf.delete()
    if not na(candle.labelRet50ltf)
        candle.labelRet50ltf.delete()
    if not na(candle.labelRet33ltf)
        candle.labelRet33ltf.delete()
    if not na(candle.labelRetMinltf)
        candle.labelRetMinltf.delete()

// (((((((((((((((((((((((((( LTF Retracement Zones Delete ))))))))))))))))))))))))))

deleteRetracementZonesltf(Candleltf candle) =>
    if not na(candle.zoneBox1ltf)
        candle.zoneBox1ltf.delete()
    if not na(candle.zoneBox2ltf)
        candle.zoneBox2ltf.delete()
    if not na(candle.zoneBox3ltf)
        candle.zoneBox3ltf.delete()
    if not na(candle.zoneBox4ltf)
        candle.zoneBox4ltf.delete()

// (((((((((((((((((((((((((( LTF Retracement Lines Delete ))))))))))))))))))))))))))

deleteRetracementLinesltf(Candleltf candle) =>
    if not na(candle.lineRetMaxltf)
        candle.lineRetMaxltf.delete()
    if not na(candle.lineRet67ltf)
        candle.lineRet67ltf.delete()
    if not na(candle.lineRet50ltf)
        candle.lineRet50ltf.delete()
    if not na(candle.lineRet33ltf)
        candle.lineRet33ltf.delete()
    if not na(candle.lineRetMinltf)
        candle.lineRetMinltf.delete()

createProjectionsltf(Candleltf candle, oltf, hltf, lltf, curr_oltf, curr_hltf, curr_lltf, ltf_o, ltf_h, ltf_l, ltf_c, l_posltf, closed_c_ltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    b_oltf = bar_index 
    b_hltf = bar_index 
    b_lltf = bar_index 
    b_cltf = bar_index 
    o_oltf = oltf
    o_hltf = hltf
    o_lltf = lltf
    o_cltf = closed_c_ltf
    if useltfData
        if ltf_o != oltf
            b_oltf := b_oltf - 1
            o_oltf := curr_oltf
            o_oltf
        if ltf_h != hltf
            b_hltf := b_hltf - 1
            o_hltf := curr_hltf
            o_hltf
        if ltf_l != lltf
            b_lltf := b_lltf - 1
            o_lltf := curr_lltf
            o_lltf
        if ltf_c != closed_c_ltf
            b_cltf := b_cltf - 1
            o_cltf := closed_c_ltf
            o_cltf

    if ltfo_enabled
        candle.oltf := line.new(b_oltf, o_oltf, m_posltf, o_oltf, style = getLineStyleltf(ltfo_style), color = ltfo_col, width = ltfo_width)
        candle.oltf
    if ltfhl_enabled
        candle.hltf := line.new(b_hltf, o_hltf, m_posltf, o_hltf, style = getLineStyleltf(ltfhl_style), color = ltfhl_col, width = ltfhl_width)
        candle.lltf := line.new(b_lltf, o_lltf, m_posltf, o_lltf, style = getLineStyleltf(ltfhl_style), color = ltfhl_col, width = ltfhl_width)
        candle.lltf
    if ltfc_enabled and not na(closed_c_ltf)
        candle.cltf := line.new(b_cltf, o_cltf, m_posltf, o_cltf, style = getLineStyleltf(ltfc_style), color = ltfc_col, width = ltfc_width)
        candle.cltf

moveProjectionsltf(Candleltf candle, l_posltf, oltf, hltf, lltf, curr_oltf, curr_hltf, curr_lltf, closed_c_ltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    if not na(candle.oltf)
        candle.oltf.set_y1(curr_oltf)
        candle.oltf.set_xy2(m_posltf, curr_oltf)
    if not na(candle.hltf)
        float old_h = candle.hltf.get_y1()
        float old_l = candle.lltf.get_y1()

        if hltf > old_h or useltfData and hltf[1] < old_h
            candle.hltf.set_x1(bar_index)
        candle.hltf.set_y1(curr_hltf)
        candle.hltf.set_xy2(m_posltf, curr_hltf)

        if lltf < old_l or useltfData and lltf[1] > old_l
            candle.lltf.set_x1(bar_index)
        candle.lltf.set_y1(curr_lltf)
        candle.lltf.set_xy2(m_posltf, curr_lltf)
    if not na(candle.cltf) and not na(closed_c_ltf)
        candle.cltf.set_y1(closed_c_ltf)
        candle.cltf.set_xy2(m_posltf, closed_c_ltf)

deleteProjectionsltf(Candleltf candle) =>
    if not na(candle.oltf)
        candle.oltf.delete()
    if not na(candle.hltf)
        candle.hltf.delete()
    if not na(candle.lltf)
        candle.lltf.delete()
    if not na(candle.cltf)
        candle.cltf.delete()

getCandlePropertiesltf(oltf, hltf, lltf, cltf) =>
    h_bodyltf = math.max(oltf, cltf)
    l_bodyltf = math.min(oltf, cltf)
    body_colltf = getCCPColorltf(cltf, oltf, true)
    wick_colltf = oltf > cltf ? ltfdown_col_wick : ltfup_col_wick
    border_colltf = oltf > cltf ? ltfdown_col_border : ltfup_col_border
    [h_bodyltf, l_bodyltf, body_colltf, wick_colltf, border_colltf]

createCandleltf(l_posltf, oltf, hltf, lltf, cltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    [h_bodyltf, l_bodyltf, body_colltf, wick_colltf, border_colltf] = getCandlePropertiesltf(oltf, hltf, lltf, cltf)
    candle = Candleltf.new()
    candle.bodyltf := box.new(l_posltf, h_bodyltf, r_posltf, l_bodyltf, border_colltf, bgcolor = body_colltf)
    candle.upperWickltf := line.new(m_posltf, h_bodyltf, m_posltf, hltf, color = wick_colltf)
    candle.lowerWickltf := line.new(m_posltf, l_bodyltf, m_posltf, lltf, color = wick_colltf)
    candle

moveCandleltf(Candleltf candle, l_posltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    candle.bodyltf.set_left(l_posltf)
    candle.bodyltf.set_right(r_posltf)
    candle.upperWickltf.set_x1(m_posltf)
    candle.upperWickltf.set_x2(m_posltf)
    candle.lowerWickltf.set_x1(m_posltf)
    candle.lowerWickltf.set_x2(m_posltf)

updateCandleltf(Candleltf candle, l_posltf, oltf, hltf, lltf, cltf) =>
    [m_posltf, r_posltf] = getCandlePostionltf(l_posltf)
    [h_bodyltf, l_bodyltf, body_colltf, wick_colltf, border_colltf] = getCandlePropertiesltf(oltf, hltf, lltf, cltf)
    candle.bodyltf.set_bgcolor(body_colltf)
    candle.bodyltf.set_lefttop(l_posltf, h_bodyltf)
    candle.bodyltf.set_rightbottom(r_posltf, l_bodyltf)
    candle.bodyltf.set_border_color(border_colltf)
    candle.upperWickltf.set_color(wick_colltf)
    candle.upperWickltf.set_xy1(m_posltf, h_bodyltf)
    candle.upperWickltf.set_xy2(m_posltf, hltf)
    candle.lowerWickltf.set_color(wick_colltf)
    candle.lowerWickltf.set_xy1(m_posltf, l_bodyltf)
    candle.lowerWickltf.set_xy2(m_posltf, lltf)

deleteCandleltf(Candleltf candle) =>
    candle.bodyltf.delete()
    candle.upperWickltf.delete()
    candle.lowerWickltf.delete()
    deleteLabelsltf(candle)
    deleteProjectionsltf(candle)
    deleteRetracementLabelsltf(candle)
    deleteRetracementZonesltf(candle)
    deleteRetracementLinesltf(candle)

var candlesltf = array.new<Candleltf>(ltfnum, Candleltf.new())
[oltf, hltf, lltf, cltf, ltf_o, ltf_h, ltf_l, ltf_c] = ohlcltf()
curr_oltf = oltf
curr_hltf = hltf
curr_lltf = lltf
curr_cltf = cltf

if useltfData
    curr_oltf := ltf_o
    curr_hltf := ltf_h
    curr_lltf := ltf_l
    curr_cltf := ltf_c
    curr_cltf

candle_oltf = curr_oltf
candle_hltf = curr_hltf
candle_lltf = curr_lltf
candle_cltf = curr_cltf

if ltftype == 'Heikin Ashi' and not chart.is_heikinashi
    candle_cltf := (curr_oltf + curr_hltf + curr_lltf + curr_cltf) / 4
    if newCandleltf
        candle_oltf := na(candle_oltf[1]) ? (curr_oltf + curr_cltf) / 2 : (nz(candle_oltf[1]) + nz(candle_cltf[1])) / 2
        candle_oltf
    else
        candle_oltf := nz(candle_oltf[1])
        candle_oltf
    candle_hltf := math.max(curr_hltf, candle_oltf, candle_cltf)
    candle_lltf := math.min(curr_lltf, candle_oltf, candle_cltf)
    candle_lltf

// (((((((((((((((((((((((((( LTF Retracement Price Calculation ))))))))))))))))))))))))))

[ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf] = getRetracementPricesltf()

if ltf_enabled and newCandleltf
    anchor_barltf := useltfData and ltf_o != oltf ? bar_index - 1 : bar_index
    oldCandle = candlesltf.shift()
    deleteCandleltf(oldCandle)
    pos = bar_index + ltfoffset + maxIndexltf * (3 + sizeMultiplierltf)
    candle = createCandleltf(pos, candle_oltf, candle_hltf, candle_lltf, candle_cltf)
    createProjectionsltf(candle, oltf, hltf, lltf, curr_oltf, curr_hltf, curr_lltf, ltf_o, ltf_h, ltf_l, ltf_c, pos, ltfc_closed)  

    if ltfohlc_enabled
        createLabelsltf(candle, curr_oltf, curr_hltf, curr_lltf, curr_cltf, pos, ltfohlc_col, getLabelSizeltf(ltfohlc_size))
    candlesltf.push(candle)

if ltf_enabled
    for [i, candle] in candlesltf
        new_posltf = bar_index + ltfoffset + i * (ltfmargin + 2 * sizeMultiplierltf)
        if i == 0  // Second to last closed candle LTF
            moveCandleltf(candle, new_posltf)
            
            deleteLabelsltf(candle)
            deleteProjectionsltf(candle) 

            // === Retracement Labels Update Closed Candle === LTF
            if ltfret_enabled
                moveRetracementLabelsltf(candle, new_posltf, ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf)
            else
                deleteRetracementLabelsltf(candle)
            
            // === Retracement Zones Update Closed Candle === LTF
            if ltfzones_enabled
                moveRetracementZonesltf(candle, new_posltf, ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf)
            else
                deleteRetracementZonesltf(candle)
            
            // === Retracement Lines Update Closed Candle === LTF
            if ltflines_enabled
                moveRetracementLinesltf(candle, new_posltf, ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf)
            else
                deleteRetracementLinesltf(candle)
                
        else if i == maxIndexltf  // Last current candle LTF
            updateCandleltf(candle, new_posltf, candle_oltf, candle_hltf, candle_lltf, candle_cltf)
            moveProjectionsltf(candle, new_posltf, oltf, hltf, lltf, curr_oltf, curr_hltf, curr_lltf, ltfc_closed) 
        
        if ltfohlc_enabled
            moveLabelsltf(candle, new_posltf, curr_oltf, curr_hltf, curr_lltf, curr_cltf)
        else
            deleteLabelsltf(candle)

// (((((((((((((((((((((((((( LTF Retracement Labels and Zones Creation - newCandleltf ))))))))))))))))))))))))))

if ltf_enabled and newCandleltf
    firstCandleltf = candlesltf.get(0)
    first_posltf = bar_index + ltfoffset
    
    if ltfret_enabled
        createRetracementLabelsltf(firstCandleltf, first_posltf, ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf)
    
    if ltfzones_enabled
        createRetracementZonesltf(firstCandleltf, first_posltf, ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf)
    
    if ltflines_enabled
        createRetracementLinesltf(firstCandleltf, first_posltf, ret_price_maxltf, ret_price_67ltf, ret_price_50ltf, ret_price_33ltf, ret_price_minltf)

// (((((((((((((((((((((((((( HTF Candle Projection Functions ))))))))))))))))))))))))))

type Candlehtf
	box bodyhtf
	line upperWickhtf
	line lowerWickhtf
	line ohtf
	line hhtf
	line lhtf
	line chtf
	label labelOhtf
	label labelHhtf
	label labelLhtf
	label labelChtf
	label labelRetMaxhtf
	label labelRet67htf
	label labelRet50htf
	label labelRet33htf
	label labelRetMinhtf
	box zoneBox1htf
	box zoneBox2htf
	box zoneBox3htf
	box zoneBox4htf
	line lineRetMaxhtf
	line lineRet67htf
	line lineRet50htf
	line lineRet33htf
	line lineRetMinhtf

ohlchtf() =>
    [htf_o, htf_h, htf_l, htf_c] = request.security(syminfo.tickerid, curr_tfhtf, [open, high, low, close], lookahead = barmerge.lookahead_off)

    var ohtf = 0.
    var hhtf = 0.
    var lhtf = 0.
    chtf = close

    if newCandlehtf
        ohtf := open
        hhtf := high
        lhtf := low
        lhtf
    else
        hhtf := math.max(high, hhtf)
        lhtf := math.min(low, lhtf)
        lhtf

    [ohtf, hhtf, lhtf, chtf, htf_o, htf_h, htf_l, htf_c]

// (((((((((((((((((((((((((( HTF Retracement Calculation Closed Candle ))))))))))))))))))))))))))

getRetracementPriceshtf() =>
    [closed_highhtf, closed_lowhtf] = request.security(syminfo.tickerid, curr_tfhtf, [high[1], low[1]], lookahead = barmerge.lookahead_off)
    candle_rangehtf = closed_highhtf - closed_lowhtf
    price_maxhtf = closed_highhtf
    price_67htf = closed_lowhtf + (candle_rangehtf * 0.6667)
    price_50htf = closed_lowhtf + (candle_rangehtf * 0.5)
    price_33htf = closed_lowhtf + (candle_rangehtf * 0.3333)
    price_minhtf = closed_lowhtf
    [price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf]

getCandlePostionhtf(l_poshtf) =>
    m_poshtf = l_poshtf + sizeMultiplierhtf
    r_poshtf = l_poshtf + sizeMultiplierhtf * 2
    [m_poshtf, r_poshtf]

createLabelhtf(r_poshtf, s, labelColor, labelSize) =>
    label.new(r_poshtf, s, str.tostring(s, format.mintick), style = label.style_label_left, color = color.new(color.black, 100), textcolor = labelColor, size = labelSize)

createLabelshtf(Candlehtf candle, ohtf, hhtf, lhtf, chtf, l_poshtf, labelColor, labelSize) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    candle.labelOhtf := createLabelhtf(r_poshtf, ohtf, labelColor, labelSize)
    candle.labelHhtf := createLabelhtf(r_poshtf, hhtf, labelColor, labelSize)
    candle.labelLhtf := createLabelhtf(r_poshtf, lhtf, labelColor, labelSize)
    candle.labelChtf := createLabelhtf(r_poshtf, chtf, labelColor, labelSize)
    candle.labelChtf

// (((((((((((((((((((((((((( HTF Retracement Labels Creation ))))))))))))))))))))))))))

createRetracementLabelshtf(Candlehtf candle, l_poshtf, price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    if htfret_enabled
        if htfret_max_enabled
            candle.labelRetMaxhtf := createLabelhtf(r_poshtf, price_maxhtf, htfret_max_col, getLabelSizehtf(htfret_max_size))
        if htfret_67_enabled
            candle.labelRet67htf := createLabelhtf(r_poshtf, price_67htf, htfret_67_col, getLabelSizehtf(htfret_67_size))
        if htfret_50_enabled
            candle.labelRet50htf := createLabelhtf(r_poshtf, price_50htf, htfret_50_col, getLabelSizehtf(htfret_50_size))
        if htfret_33_enabled
            candle.labelRet33htf := createLabelhtf(r_poshtf, price_33htf, htfret_33_col, getLabelSizehtf(htfret_33_size))
        if htfret_min_enabled
            candle.labelRetMinhtf := createLabelhtf(r_poshtf, price_minhtf, htfret_min_col, getLabelSizehtf(htfret_min_size))

// (((((((((((((((((((((((((( HTF Retracement Zones Creation ))))))))))))))))))))))))))

createRetracementZoneshtf(Candlehtf candle, l_poshtf, price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf) =>
    if htfzones_enabled
        [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
        // Calculate the final position of the second current candle HTF
        second_candle_l_poshtf = bar_index + htfoffset + maxIndexhtf * (htfmargin + 2 * sizeMultiplierhtf)
        [_, second_candle_r_poshtf] = getCandlePostionhtf(second_candle_l_poshtf)
        // Use the position of the second candle when not extending HTF
        right_poshtf = htfzones_extend ? bar_index + 500 : second_candle_r_poshtf
        
        candle.zoneBox1htf := box.new(l_poshtf, price_maxhtf, right_poshtf, price_67htf, border_color = color.new(htfzone1_col, 100), bgcolor = htfzone1_col)
        candle.zoneBox2htf := box.new(l_poshtf, price_67htf, right_poshtf, price_50htf, border_color = color.new(htfzone2_col, 100), bgcolor = htfzone2_col)
        candle.zoneBox3htf := box.new(l_poshtf, price_50htf, right_poshtf, price_33htf, border_color = color.new(htfzone3_col, 100), bgcolor = htfzone3_col)
        candle.zoneBox4htf := box.new(l_poshtf, price_33htf, right_poshtf, price_minhtf, border_color = color.new(htfzone4_col, 100), bgcolor = htfzone4_col)

// (((((((((((((((((((((((((( HTF Retracement Lines Creation ))))))))))))))))))))))))))

createRetracementLineshtf(Candlehtf candle, l_poshtf, price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf) =>
    if htflines_enabled
        [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
        // Calculate the final position of the second current candle HTF
        second_candle_l_poshtf = bar_index + htfoffset + maxIndexhtf * (htfmargin + 2 * sizeMultiplierhtf)
        [_, second_candle_r_poshtf] = getCandlePostionhtf(second_candle_l_poshtf)
        // Use the position of the second candle when not extending HTF
        right_poshtf = htflines_extend ? bar_index + 500 : second_candle_r_poshtf
        
        if htfline_max_enabled
            candle.lineRetMaxhtf := line.new(l_poshtf, price_maxhtf, right_poshtf, price_maxhtf, color = htfline_max_col, style = getLineStylehtf(htfline_max_style), width = htfline_max_width)
        if htfline_67_enabled
            candle.lineRet67htf := line.new(l_poshtf, price_67htf, right_poshtf, price_67htf, color = htfline_67_col, style = getLineStylehtf(htfline_67_style), width = htfline_67_width)
        if htfline_50_enabled
            candle.lineRet50htf := line.new(bar_index + 1, price_50htf, right_poshtf, price_50htf, color = htfline_50_col, style = getLineStylehtf(htfline_50_style), width = htfline_50_width)
        if htfline_33_enabled
            candle.lineRet33htf := line.new(l_poshtf, price_33htf, right_poshtf, price_33htf, color = htfline_33_col, style = getLineStylehtf(htfline_33_style), width = htfline_33_width)
        if htfline_min_enabled
            candle.lineRetMinhtf := line.new(l_poshtf, price_minhtf, right_poshtf, price_minhtf, color = htfline_min_col, style = getLineStylehtf(htfline_min_style), width = htfline_min_width)

moveLabelhtf(label la, r_poshtf, s) =>
    la.set_text(str.tostring(s, format.mintick))
    la.set_xy(r_poshtf, s)

moveLabelshtf(Candlehtf candle, l_poshtf, ohtf, hhtf, lhtf, chtf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    moveLabelhtf(candle.labelOhtf, r_poshtf, ohtf)
    moveLabelhtf(candle.labelHhtf, r_poshtf, hhtf)
    moveLabelhtf(candle.labelLhtf, r_poshtf, lhtf)
    moveLabelhtf(candle.labelChtf, r_poshtf, chtf)

// (((((((((((((((((((((((((( HTF Retracement Labels Movement ))))))))))))))))))))))))))

moveRetracementLabelshtf(Candlehtf candle, l_poshtf, price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    if not na(candle.labelRetMaxhtf)
        moveLabelhtf(candle.labelRetMaxhtf, r_poshtf, price_maxhtf)
    if not na(candle.labelRet67htf)
        moveLabelhtf(candle.labelRet67htf, r_poshtf, price_67htf)
    if not na(candle.labelRet50htf)
        moveLabelhtf(candle.labelRet50htf, r_poshtf, price_50htf)
    if not na(candle.labelRet33htf)
        moveLabelhtf(candle.labelRet33htf, r_poshtf, price_33htf)
    if not na(candle.labelRetMinhtf)
        moveLabelhtf(candle.labelRetMinhtf, r_poshtf, price_minhtf)

// (((((((((((((((((((((((((( HTF Retracement Zones Movement ))))))))))))))))))))))))))

moveRetracementZoneshtf(Candlehtf candle, l_poshtf, price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf) =>
    if htfzones_enabled and not na(candle.zoneBox1htf)
        [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
        // Calculate the final position of the second current candle HTF
        second_candle_l_poshtf = bar_index + htfoffset + maxIndexhtf * (htfmargin + 2 * sizeMultiplierhtf)
        [_, second_candle_r_poshtf] = getCandlePostionhtf(second_candle_l_poshtf)
        // Use the position of the second candle when not extending HTF
        right_poshtf = htfzones_extend ? bar_index + 500 : second_candle_r_poshtf
        
        candle.zoneBox1htf.set_lefttop(l_poshtf, price_maxhtf)
        candle.zoneBox1htf.set_rightbottom(right_poshtf, price_67htf)
        
        candle.zoneBox2htf.set_lefttop(l_poshtf, price_67htf)
        candle.zoneBox2htf.set_rightbottom(right_poshtf, price_50htf)
        
        candle.zoneBox3htf.set_lefttop(l_poshtf, price_50htf)
        candle.zoneBox3htf.set_rightbottom(right_poshtf, price_33htf)
        
        candle.zoneBox4htf.set_lefttop(l_poshtf, price_33htf)
        candle.zoneBox4htf.set_rightbottom(right_poshtf, price_minhtf)

// (((((((((((((((((((((((((( HTF Retracement Lines Movement ))))))))))))))))))))))))))

moveRetracementLineshtf(Candlehtf candle, l_poshtf, price_maxhtf, price_67htf, price_50htf, price_33htf, price_minhtf) =>
    if htflines_enabled
        [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
        // Calculate the final position of the second current candle HTF
        second_candle_l_poshtf = bar_index + htfoffset + maxIndexhtf * (htfmargin + 2 * sizeMultiplierhtf)
        [_, second_candle_r_poshtf] = getCandlePostionhtf(second_candle_l_poshtf)
        // Use the position of the second candle when not extending HTF
        right_poshtf = htflines_extend ? bar_index + 500 : second_candle_r_poshtf
        
        if not na(candle.lineRetMaxhtf)
            candle.lineRetMaxhtf.set_xy1(l_poshtf, price_maxhtf)
            candle.lineRetMaxhtf.set_xy2(right_poshtf, price_maxhtf)
        if not na(candle.lineRet67htf)
            candle.lineRet67htf.set_xy1(l_poshtf, price_67htf)
            candle.lineRet67htf.set_xy2(right_poshtf, price_67htf)
        if not na(candle.lineRet50htf)
            candle.lineRet50htf.set_xy1(bar_index + 1, price_50htf)
            candle.lineRet50htf.set_xy2(right_poshtf, price_50htf)
        if not na(candle.lineRet33htf)
            candle.lineRet33htf.set_xy1(l_poshtf, price_33htf)
            candle.lineRet33htf.set_xy2(right_poshtf, price_33htf)
        if not na(candle.lineRetMinhtf)
            candle.lineRetMinhtf.set_xy1(l_poshtf, price_minhtf)
            candle.lineRetMinhtf.set_xy2(right_poshtf, price_minhtf)

deleteLabelshtf(Candlehtf candle) =>
    if not na(candle.labelOhtf)
        candle.labelOhtf.delete()
    if not na(candle.labelHhtf)
        candle.labelHhtf.delete()
    if not na(candle.labelLhtf)
        candle.labelLhtf.delete()
    if not na(candle.labelChtf)
        candle.labelChtf.delete()

// (((((((((((((((((((((((((( HTF Retracement Label Delete ))))))))))))))))))))))))))

deleteRetracementLabelshtf(Candlehtf candle) =>
    if not na(candle.labelRetMaxhtf)
        candle.labelRetMaxhtf.delete()
    if not na(candle.labelRet67htf)
        candle.labelRet67htf.delete()
    if not na(candle.labelRet50htf)
        candle.labelRet50htf.delete()
    if not na(candle.labelRet33htf)
        candle.labelRet33htf.delete()
    if not na(candle.labelRetMinhtf)
        candle.labelRetMinhtf.delete()

// (((((((((((((((((((((((((( HTF Retracement Zones Delete ))))))))))))))))))))))))))

deleteRetracementZoneshtf(Candlehtf candle) =>
    if not na(candle.zoneBox1htf)
        candle.zoneBox1htf.delete()
    if not na(candle.zoneBox2htf)
        candle.zoneBox2htf.delete()
    if not na(candle.zoneBox3htf)
        candle.zoneBox3htf.delete()
    if not na(candle.zoneBox4htf)
        candle.zoneBox4htf.delete()

// (((((((((((((((((((((((((( HTF Retracement Lines Delete ))))))))))))))))))))))))))

deleteRetracementLineshtf(Candlehtf candle) =>
    if not na(candle.lineRetMaxhtf)
        candle.lineRetMaxhtf.delete()
    if not na(candle.lineRet67htf)
        candle.lineRet67htf.delete()
    if not na(candle.lineRet50htf)
        candle.lineRet50htf.delete()
    if not na(candle.lineRet33htf)
        candle.lineRet33htf.delete()
    if not na(candle.lineRetMinhtf)
        candle.lineRetMinhtf.delete()

createProjectionshtf(Candlehtf candle, ohtf, hhtf, lhtf, curr_ohtf, curr_hhtf, curr_lhtf, htf_o, htf_h, htf_l, htf_c, l_poshtf, closed_c_htf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    b_ohtf = bar_index
    b_hhtf = bar_index
    b_lhtf = bar_index
    b_chtf = bar_index
    o_ohtf = ohtf
    o_hhtf = hhtf
    o_lhtf = lhtf
    o_chtf = closed_c_htf
    if usehtfData
        if htf_o != ohtf
            b_ohtf := b_ohtf - 1
            o_ohtf := curr_ohtf
            o_ohtf
        if htf_h != hhtf
            b_hhtf := b_hhtf - 1
            o_hhtf := curr_hhtf
            o_hhtf
        if htf_l != lhtf
            b_lhtf := b_lhtf - 1
            o_lhtf := curr_lhtf
            o_lhtf
        if htf_c != closed_c_htf
            b_chtf := b_chtf - 1
            o_chtf := closed_c_htf
            o_chtf

    if htfo_enabled
        candle.ohtf := line.new(b_ohtf, o_ohtf, m_poshtf, o_ohtf, style = getLineStylehtf(htfo_style), color = htfo_col, width = htfo_width)
        candle.ohtf
    if htfhl_enabled
        candle.hhtf := line.new(b_hhtf, o_hhtf, m_poshtf, o_hhtf, style = getLineStylehtf(htfhl_style), color = htfhl_col, width = htfhl_width)
        candle.lhtf := line.new(b_lhtf, o_lhtf, m_poshtf, o_lhtf, style = getLineStylehtf(htfhl_style), color = htfhl_col, width = htfhl_width)
        candle.lhtf
    if htfc_enabled and not na(closed_c_htf)
        candle.chtf := line.new(b_chtf, o_chtf, m_poshtf, o_chtf, style = getLineStylehtf(htfc_style), color = htfc_col, width = htfc_width)
        candle.chtf

moveProjectionshtf(Candlehtf candle, l_poshtf, ohtf, hhtf, lhtf, curr_ohtf, curr_hhtf, curr_lhtf, closed_c_htf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    if not na(candle.ohtf)
        candle.ohtf.set_y1(curr_ohtf)
        candle.ohtf.set_xy2(m_poshtf, curr_ohtf)
    if not na(candle.hhtf)
        float old_h = candle.hhtf.get_y1()
        float old_l = candle.lhtf.get_y1()

        if hhtf > old_h or usehtfData and hhtf[1] < old_h
            candle.hhtf.set_x1(bar_index)
        candle.hhtf.set_y1(curr_hhtf)
        candle.hhtf.set_xy2(m_poshtf, curr_hhtf)

        if lhtf < old_l or usehtfData and lhtf[1] > old_l
            candle.lhtf.set_x1(bar_index)
        candle.lhtf.set_y1(curr_lhtf)
        candle.lhtf.set_xy2(m_poshtf, curr_lhtf)
    if not na(candle.chtf) and not na(closed_c_htf)
        candle.chtf.set_y1(closed_c_htf)
        candle.chtf.set_xy2(m_poshtf, closed_c_htf)

deleteProjectionshtf(Candlehtf candle) =>
    if not na(candle.ohtf)
        candle.ohtf.delete()
    if not na(candle.hhtf)
        candle.hhtf.delete()
    if not na(candle.lhtf)
        candle.lhtf.delete()
    if not na(candle.chtf)
        candle.chtf.delete()
        
getCandlePropertieshtf(ohtf, hhtf, lhtf, chtf) =>
    h_bodyhtf = math.max(ohtf, chtf)
    l_bodyhtf = math.min(ohtf, chtf)
    body_colhtf = getCCPColorhtf(chtf, ohtf, true)
    wick_colhtf = ohtf > chtf ? htfdown_col_wick : htfup_col_wick
    border_colhtf = ohtf > chtf ? htfdown_col_border : htfup_col_border
    [h_bodyhtf, l_bodyhtf, body_colhtf, wick_colhtf, border_colhtf]

createCandlehtf(l_poshtf, ohtf, hhtf, lhtf, chtf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    [h_bodyhtf, l_bodyhtf, body_colhtf, wick_colhtf, border_colhtf] = getCandlePropertieshtf(ohtf, hhtf, lhtf, chtf)
    candle = Candlehtf.new()
    candle.bodyhtf := box.new(l_poshtf, h_bodyhtf, r_poshtf, l_bodyhtf, border_colhtf, bgcolor = body_colhtf)
    candle.upperWickhtf := line.new(m_poshtf, h_bodyhtf, m_poshtf, hhtf, color = wick_colhtf)
    candle.lowerWickhtf := line.new(m_poshtf, l_bodyhtf, m_poshtf, lhtf, color = wick_colhtf)
    candle

moveCandlehtf(Candlehtf candle, l_poshtf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    candle.bodyhtf.set_left(l_poshtf)
    candle.bodyhtf.set_right(r_poshtf)
    candle.upperWickhtf.set_x1(m_poshtf)
    candle.upperWickhtf.set_x2(m_poshtf)
    candle.lowerWickhtf.set_x1(m_poshtf)
    candle.lowerWickhtf.set_x2(m_poshtf)

updateCandlehtf(Candlehtf candle, l_poshtf, ohtf, hhtf, lhtf, chtf) =>
    [m_poshtf, r_poshtf] = getCandlePostionhtf(l_poshtf)
    [h_bodyhtf, l_bodyhtf, body_colhtf, wick_colhtf, border_colhtf] = getCandlePropertieshtf(ohtf, hhtf, lhtf, chtf)
    candle.bodyhtf.set_bgcolor(body_colhtf)
    candle.bodyhtf.set_lefttop(l_poshtf, h_bodyhtf)
    candle.bodyhtf.set_rightbottom(r_poshtf, l_bodyhtf)
    candle.bodyhtf.set_border_color(border_colhtf)
    candle.upperWickhtf.set_color(wick_colhtf)
    candle.upperWickhtf.set_xy1(m_poshtf, h_bodyhtf)
    candle.upperWickhtf.set_xy2(m_poshtf, hhtf)
    candle.lowerWickhtf.set_color(wick_colhtf)
    candle.lowerWickhtf.set_xy1(m_poshtf, l_bodyhtf)
    candle.lowerWickhtf.set_xy2(m_poshtf, lhtf)

deleteCandlehtf(Candlehtf candle) =>
    candle.bodyhtf.delete()
    candle.upperWickhtf.delete()
    candle.lowerWickhtf.delete()
    deleteLabelshtf(candle)
    deleteProjectionshtf(candle)
    deleteRetracementLabelshtf(candle)
    deleteRetracementZoneshtf(candle)
    deleteRetracementLineshtf(candle)

var candleshtf = array.new<Candlehtf>(htfnum, Candlehtf.new())
[ohtf, hhtf, lhtf, chtf, htf_o, htf_h, htf_l, htf_c] = ohlchtf()
curr_ohtf = ohtf
curr_hhtf = hhtf
curr_lhtf = lhtf
curr_chtf = chtf

if usehtfData
    curr_ohtf := htf_o
    curr_hhtf := htf_h
    curr_lhtf := htf_l
    curr_chtf := htf_c
    curr_chtf

candle_ohtf = curr_ohtf
candle_hhtf = curr_hhtf
candle_lhtf = curr_lhtf
candle_chtf = curr_chtf

if htftype == 'Heikin Ashi' and not chart.is_heikinashi
    candle_chtf := (curr_ohtf + curr_hhtf + curr_lhtf + curr_chtf) / 4
    if newCandlehtf
        candle_ohtf := na(candle_ohtf[1]) ? (curr_ohtf + curr_chtf) / 2 : (nz(candle_ohtf[1]) + nz(candle_chtf[1])) / 2
        candle_ohtf
    else
        candle_ohtf := nz(candle_ohtf[1])
        candle_ohtf
    candle_hhtf := math.max(curr_hhtf, candle_ohtf, candle_chtf)
    candle_lhtf := math.min(curr_lhtf, candle_ohtf, candle_chtf)
    candle_lhtf

// (((((((((((((((((((((((((( HTF Retracement Price Calculation ))))))))))))))))))))))))))

[ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf] = getRetracementPriceshtf()

if htf_enabled and newCandlehtf
    anchor_barhtf := usehtfData and htf_o != ohtf ? bar_index - 1 : bar_index
    oldCandle = candleshtf.shift()
    deleteCandlehtf(oldCandle)
    pos = bar_index + htfoffset + maxIndexhtf * (3 + sizeMultiplierhtf)
    candle = createCandlehtf(pos, candle_ohtf, candle_hhtf, candle_lhtf, candle_chtf)
    createProjectionshtf(candle, ohtf, hhtf, lhtf, curr_ohtf, curr_hhtf, curr_lhtf, htf_o, htf_h, htf_l, htf_c, pos, htfc_closed)  

    if htfohlc_enabled
        createLabelshtf(candle, curr_ohtf, curr_hhtf, curr_lhtf, curr_chtf, pos, htfohlc_col, getLabelSizehtf(htfohlc_size))
    candleshtf.push(candle)

if htf_enabled
    for [i, candle] in candleshtf
        new_poshtf = bar_index + htfoffset + i * (htfmargin + 2 * sizeMultiplierhtf)
        if i == 0  // Second to last closed candle HTF
            moveCandlehtf(candle, new_poshtf)
            
            deleteLabelshtf(candle)
            deleteProjectionshtf(candle) 

            // === Retracement Labels Update Closed Candle === HTF
            if htfret_enabled
                moveRetracementLabelshtf(candle, new_poshtf, ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf)
            else
                deleteRetracementLabelshtf(candle)
            
            // === Retracement Zones Update Closed Candle === HTF
            if htfzones_enabled
                moveRetracementZoneshtf(candle, new_poshtf, ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf)
            else
                deleteRetracementZoneshtf(candle)
            
            // === Retracement Lines Update Closed Candle === HTF
            if htflines_enabled
                moveRetracementLineshtf(candle, new_poshtf, ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf)
            else
                deleteRetracementLineshtf(candle)
                
        else if i == maxIndexhtf  // Last current Candle HTF
            updateCandlehtf(candle, new_poshtf, candle_ohtf, candle_hhtf, candle_lhtf, candle_chtf)
            moveProjectionshtf(candle, new_poshtf, ohtf, hhtf, lhtf, curr_ohtf, curr_hhtf, curr_lhtf, htfc_closed) 
        
        if htfohlc_enabled
            moveLabelshtf(candle, new_poshtf, curr_ohtf, curr_hhtf, curr_lhtf, curr_chtf)
        else
            deleteLabelshtf(candle)

// (((((((((((((((((((((((((( HTF Retracement Labels and Zones Creation - newCandlehtf ))))))))))))))))))))))))))

if htf_enabled and newCandlehtf
    firstCandlehtf = candleshtf.get(0)
    first_poshtf = bar_index + htfoffset
    
    if htfret_enabled
        createRetracementLabelshtf(firstCandlehtf, first_poshtf, ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf)
    
    if htfzones_enabled
        createRetracementZoneshtf(firstCandlehtf, first_poshtf, ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf)
    
    if htflines_enabled
        createRetracementLineshtf(firstCandlehtf, first_poshtf, ret_price_maxhtf, ret_price_67htf, ret_price_50htf, ret_price_33htf, ret_price_minhtf)

// (((((((((((((((((((((((((( Retracement Prices Alert Logic ))))))))))))))))))))))))))

ltf_max = ltf_enabled and (ta.cross(close, ret_price_maxltf))
ltf_67  = ltf_enabled and (ta.cross(close, ret_price_67ltf))
ltf_50  = ltf_enabled and (ta.cross(close, ret_price_50ltf))
ltf_33  = ltf_enabled and (ta.cross(close, ret_price_33ltf))
ltf_min = ltf_enabled and (ta.cross(close, ret_price_minltf))
ltf_any = ltf_max or ltf_67 or ltf_50 or ltf_33 or ltf_min
htf_max = htf_enabled and (ta.cross(close, ret_price_maxhtf))
htf_67  = htf_enabled and (ta.cross(close, ret_price_67htf))
htf_50  = htf_enabled and (ta.cross(close, ret_price_50htf))
htf_33  = htf_enabled and (ta.cross(close, ret_price_33htf))
htf_min = htf_enabled and (ta.cross(close, ret_price_minhtf))
htf_any = htf_max or htf_67 or htf_50 or htf_33 or htf_min

// (((((((((((((((((((((((((( Alerts Conditions ))))))))))))))))))))))))))

//alertcondition(candleProgressionChanged and currentCandleProgressionState == "BullZ2Z3", title="CCP_Z2Z3_bullish", message="CCP_Z2Z3_bullish {{ticker}} {{interval}}")
//alertcondition(candleProgressionChanged and currentCandleProgressionState == "BearZ2Z3", title="CCP_Z2Z3_bearish", message="CCP_Z2Z3_bearish {{ticker}} {{interval}}")
//alertcondition(candleProgressionChanged and currentCandleProgressionState == "BullZ3Z4", title="CCP_Z3Z4_bullish", message="CCP_Z3Z4_bullish {{ticker}} {{interval}}")
//alertcondition(candleProgressionChanged and currentCandleProgressionState == "BearZ3Z4", title="CCP_Z3Z4_bearish", message="CCP_Z3Z4_bearish {{ticker}} {{interval}}")
//alertcondition(CandleProgressionSignal, title="CandleProgression", message="CandleProgression {{ticker}} {{interval}}")
//alertcondition(CoreZoneTwist_bullish, title="Core Zone Twist Bullish", message="Core Zone Twist Bullish {{ticker}} {{interval}}")
//alertcondition(CoreZoneTwist_bearish, title="Core Zone Twist Bearish", message="Core Zone Twist Bearish {{ticker}} {{interval}}")
//alertcondition(TrailAxisCandlesCrossing_bullish, title="Trail Axis X Candles Bullish", message="Trail Axis X Candles Bullish {{ticker}} {{interval}}")
//alertcondition(TrailAxisCandlesCrossing_bearish, title="Trail Axis X Candles Bearish", message="Trail Axis X CandlesBearish {{ticker}} {{interval}}")
//alertcondition(TrailaxisXtransitionomega_bullish, title="Trail Axis X Trasition Omega Bullish", message="Trail Axis X Trasition Omega Bullish {{ticker}} {{interval}}")
//alertcondition(TrailaxisXtransitionomega_bearish, title="Trail Axis X Trasition Omega Bearish", message="Trail Axis X Trasition Omega Bearish {{ticker}} {{interval}}")
//alertcondition(Convergence_Bullish, title="Convergence Bullish", message="Convergence Bullish {{ticker}} {{interval}}")
//alertcondition(Convergence_Bearish, title="Convergence Bearish", message="Convergence Bearish {{ticker}} {{interval}}")
//alertcondition(Convergence, title="Convergence", message="Convergence {{ticker}} {{interval}}")
//alertcondition(htf_any, title="HTF Retc", message="HTF Retc {{ticker}} {{interval}}")
//alertcondition(htf_max, title="HTF High", message="HTF High {{ticker}} {{interval}}")
//alertcondition(htf_min, title="HTF Low", message="HTF Low {{ticker}} {{interval}}")
//alertcondition(htf_67,  title="HTF 66%", message="HTF 66% {{ticker}} {{interval}}")
//alertcondition(htf_50,  title="HTF 50%", message="HTF 50% {{ticker}} {{interval}}")
//alertcondition(htf_33,  title="HTF 33%", message="HTF 33% {{ticker}} {{interval}}")
//alertcondition(ltf_any, title="LTF Retc", message="LTF Retc {{ticker}} {{interval}}")
//alertcondition(ltf_max, title="LTF High", message="LTF High {{ticker}} {{interval}}")
//alertcondition(ltf_min, title="LTF Low", message="LTF Low {{ticker}} {{interval}}")
//alertcondition(ltf_67,  title="LTF 66%", message="LTF 66% {{ticker}} {{interval}}")
//alertcondition(ltf_50,  title="LTF 50%", message="LTF 50% {{ticker}} {{interval}}")
//alertcondition(ltf_33,  title="LTF 33%", message="LTF 33% {{ticker}} {{interval}}")
//alertcondition(ltf_any or htf_any, title="Retc", message="Retc {{ticker}} {{interval}}")

// (((((((((((((((((((((((((( Alerts Conditions Active ))))))))))))))))))))))))))

alertcondition(CoreZoneTwist, title="Twist", message="Twist {{ticker}} {{interval}}")
alertcondition(TrailAxisCandlesCrossing, title="First Cross", message="First Cross {{ticker}} {{interval}}")
alertcondition(TrailaxisTransitionOmegaCrossing, title="Last Cross", message="Last Cross {{ticker}} {{interval}}")
alertcondition(CandlesTransitionOmegaCrossing, title="BreakOut", message="BreakOut {{ticker}} {{interval}}")


