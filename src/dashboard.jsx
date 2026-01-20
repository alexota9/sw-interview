import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from 'recharts';
import * as Papa from 'papaparse';

// Brand Color palette
const colors = {
  brand: {
    purple: '#5e2d91',
    gold: '#F9AB21',
    teal: '#80ceca',
  },
  bg: '#0f172a',
  card: '#1e293b',
  cardHover: '#334155',
  border: '#334155',
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
  chart: {
    primary: '#5e2d91',
    highlight: '#80ceca',
    accent: '#F9AB21',
    secondary: '#64748b',
    grid: '#334155',
    anomaly: '#ef4444',
  },
  semantic: {
    warning: '#f59e0b',
    danger: '#ef4444',
  }
};

// Month name mapping
const monthNames = {
  '2025-06': 'June',
  '2025-07': 'July',
  '2025-08': 'August',
  '2025-09': 'September',
  '2025-10': 'October',
  '2025-11': 'November',
  '2025-12': 'December'
};

const getMonthName = (yearMonth) => monthNames[yearMonth] || yearMonth;

// Format helpers
const formatCurrency = (value) => {
  if (!value && value !== 0) return '-';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const formatNumber = (value) => {
  if (!value && value !== 0) return '-';
  return value.toLocaleString();
};

// Custom Tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: colors.card,
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    }}>
      <p style={{ color: colors.text.secondary, fontSize: '12px', marginBottom: '6px' }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || colors.text.primary, fontSize: '14px', fontWeight: 600 }}>
          {entry.name}: {entry.name.toLowerCase().includes('revenue') ? formatCurrency(entry.value) : formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
};

// KPI Card Component
const KPICard = ({ label, value, subtext, alert, highlight }) => (
  <div style={{
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '20px 24px',
    border: `1px solid ${alert ? colors.brand.gold : highlight ? colors.brand.teal : colors.border}`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {alert && (
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        backgroundColor: colors.brand.gold,
        color: colors.bg,
        padding: '4px 8px',
        fontSize: '10px',
        fontWeight: 700,
        borderBottomLeftRadius: '8px'
      }}>ANOMALY</div>
    )}
    <div style={{ fontSize: '12px', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
      {label}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 600, color: highlight ? colors.brand.teal : colors.text.primary, marginBottom: '4px' }}>
      {value}
    </div>
    {subtext && (
      <div style={{ fontSize: '12px', color: colors.text.secondary }}>
        {subtext}
      </div>
    )}
  </div>
);

// Filter Dropdown
const FilterDropdown = ({ label, value, options, onChange, disabled }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11px', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        backgroundColor: colors.card,
        color: colors.text.primary,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        minWidth: '160px'
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Alert Banner
const AlertBanner = ({ type, children }) => {
  const bgColor = type === 'error' ? `${colors.semantic.danger}20` : `${colors.brand.gold}20`;
  const borderColor = type === 'error' ? colors.semantic.danger : colors.brand.gold;

  return (
    <div style={{
      backgroundColor: bgColor,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ color: borderColor, fontSize: '18px' }}>⚠️</span>
      <div style={{ color: colors.text.primary, fontSize: '14px', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
};

// Info Banner
const InfoBanner = ({ children }) => (
  <div style={{
    backgroundColor: `${colors.brand.teal}15`,
    borderLeft: `4px solid ${colors.brand.teal}`,
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}>
    <span style={{ color: colors.brand.teal, fontSize: '16px' }}>ℹ️</span>
    <div style={{ color: colors.text.secondary, fontSize: '13px' }}>
      {children}
    </div>
  </div>
);

// File Upload Component
const FileUpload = ({ onFileLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback((file) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setError(null);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Parse error: ${results.errors[0].message}`);
          return;
        }
        onFileLoad(results.data);
      },
      error: (err) => {
        setError(`Error reading file: ${err.message}`);
      }
    });
  }, [onFileLoad]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: colors.bg,
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: colors.text.primary,
          fontSize: '32px',
          fontWeight: 300,
          marginBottom: '12px'
        }}>
          Sales Data Explorer
        </h1>
        <p style={{
          color: colors.text.secondary,
          fontSize: '16px',
          marginBottom: '40px'
        }}>
          Upload your cleaned_data.csv to begin analysis
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${isDragging ? colors.brand.teal : colors.border}`,
            borderRadius: '16px',
            padding: '60px 40px',
            backgroundColor: isDragging ? `${colors.brand.teal}10` : colors.card,
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.7
          }}>📊</div>
          <p style={{
            color: colors.text.primary,
            fontSize: '16px',
            marginBottom: '8px',
            fontWeight: 500
          }}>
            Drop CSV file here
          </p>
          <p style={{
            color: colors.text.muted,
            fontSize: '14px'
          }}>
            or click to browse
          </p>

          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </div>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            backgroundColor: `${colors.semantic.danger}20`,
            borderRadius: '8px',
            color: colors.semantic.danger,
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <p style={{
          color: colors.text.muted,
          fontSize: '12px',
          marginTop: '24px'
        }}>
          Expected columns: customer_id, city, state, zip, product, quantity, price, total_value, date, year_month
        </p>
      </div>
    </div>
  );
};

// Main Dashboard
const Dashboard = ({ rawData }) => {
  // Filter out zero-quantity records
  const data = useMemo(() => {
    return rawData.filter(d => d.quantity > 0);
  }, [rawData]);

  const excludedCount = rawData.length - data.length;

  // Filters
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');

  // Compute filter options from data
  const filterOptions = useMemo(() => {
    const months = [...new Set(data.map(d => d.year_month))].sort();
    const states = [...new Set(data.map(d => d.state).filter(Boolean))].sort();
    const products = [...new Set(data.map(d => d.product).filter(Boolean))].sort();

    // Cities based on selected state
    let cities;
    if (selectedState === 'all') {
      cities = [...new Set(data.map(d => d.city).filter(Boolean))].sort();
    } else {
      cities = [...new Set(data.filter(d => d.state === selectedState).map(d => d.city).filter(Boolean))].sort();
    }

    return {
      months: [{ value: 'all', label: 'All Months' }, ...months.map(m => ({ value: m, label: getMonthName(m) }))],
      states: [{ value: 'all', label: 'All States' }, ...states.map(s => ({ value: s, label: s }))],
      cities: [{ value: 'all', label: 'All Cities' }, ...cities.map(c => ({ value: c, label: c }))],
      products: [{ value: 'all', label: 'All Products' }, ...products.map(p => ({ value: p, label: p }))]
    };
  }, [data, selectedState]);

  // Reset city when state changes
  useEffect(() => {
    setSelectedCity('all');
  }, [selectedState]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(d => {
      if (selectedMonth !== 'all' && d.year_month !== selectedMonth) return false;
      if (selectedState !== 'all' && d.state !== selectedState) return false;
      if (selectedCity !== 'all' && d.city !== selectedCity) return false;
      if (selectedProduct !== 'all' && d.product !== selectedProduct) return false;
      return true;
    });
  }, [data, selectedMonth, selectedState, selectedCity, selectedProduct]);

  // Compute KPIs
  const kpis = useMemo(() => {
    const revenue = filteredData.reduce((sum, d) => sum + (d.total_value || 0), 0);
    const units = filteredData.reduce((sum, d) => sum + (d.quantity || 0), 0);
    const customers = new Set(filteredData.map(d => d.customer_id)).size;
    const transactions = filteredData.length;
    const avgTransaction = transactions > 0 ? revenue / transactions : 0;

    return { revenue, units, customers, transactions, avgTransaction };
  }, [filteredData]);

  // Detect Aug/Sep anomaly
  const anomalyDetected = useMemo(() => {
    const augRevenue = data.filter(d => d.year_month === '2025-08').reduce((sum, d) => sum + (d.total_value || 0), 0);
    const sepRevenue = data.filter(d => d.year_month === '2025-09').reduce((sum, d) => sum + (d.total_value || 0), 0);
    return Math.abs(augRevenue - sepRevenue) < 1 && augRevenue > 0;
  }, [data]);

  // Monthly revenue data with month names
  const monthlyData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!grouped[d.year_month]) {
        grouped[d.year_month] = {
          yearMonth: d.year_month,
          month: getMonthName(d.year_month),
          revenue: 0,
          units: 0,
          transactions: 0
        };
      }
      grouped[d.year_month].revenue += d.total_value || 0;
      grouped[d.year_month].units += d.quantity || 0;
      grouped[d.year_month].transactions += 1;
    });
    return Object.values(grouped).sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  }, [filteredData]);

  // Product revenue data
  const productData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      if (!d.product) return;
      if (!grouped[d.product]) {
        grouped[d.product] = { product: d.product, revenue: 0, units: 0 };
      }
      grouped[d.product].revenue += d.total_value || 0;
      grouped[d.product].units += d.quantity || 0;
    });
    return Object.values(grouped).sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  // State revenue data
  const stateData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      const state = d.state || 'Unknown';
      if (!grouped[state]) {
        grouped[state] = { state, revenue: 0, transactions: 0 };
      }
      grouped[state].revenue += d.total_value || 0;
      grouped[state].transactions += 1;
    });
    return Object.values(grouped).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filteredData]);

  // City revenue data (top 10)
  const cityData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(d => {
      const city = d.city || 'Unknown';
      if (!grouped[city]) {
        grouped[city] = { city, revenue: 0, transactions: 0 };
      }
      grouped[city].revenue += d.total_value || 0;
      grouped[city].transactions += 1;
    });
    return Object.values(grouped).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filteredData]);

  // Detect if Aug or Sep is in view with anomaly
  const showAnomalyLine = useMemo(() => {
    if (!anomalyDetected) return false;
    if (selectedMonth !== 'all') return false;
    return monthlyData.some(d => d.yearMonth === '2025-08' || d.yearMonth === '2025-09');
  }, [anomalyDetected, selectedMonth, monthlyData]);

  const anomalyValue = useMemo(() => {
    const aug = data.filter(d => d.year_month === '2025-08').reduce((sum, d) => sum + (d.total_value || 0), 0);
    return aug;
  }, [data]);

  return (
    <div style={{
      backgroundColor: colors.bg,
      minHeight: '100vh',
      color: colors.text.primary,
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 40px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        backgroundColor: colors.bg,
        zIndex: 100
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px', color: colors.brand.teal }}>
            Sales Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: colors.text.muted }}>
            H2 2025 · {formatNumber(data.length)} sales records
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <FilterDropdown
            label="Month"
            value={selectedMonth}
            options={filterOptions.months}
            onChange={setSelectedMonth}
          />
          <FilterDropdown
            label="State"
            value={selectedState}
            options={filterOptions.states}
            onChange={setSelectedState}
          />
          <FilterDropdown
            label="City"
            value={selectedCity}
            options={filterOptions.cities}
            onChange={setSelectedCity}
            disabled={selectedState === 'all'}
          />
          <FilterDropdown
            label="Product"
            value={selectedProduct}
            options={filterOptions.products}
            onChange={setSelectedProduct}
          />
        </div>
      </header>

      <main style={{ padding: '32px 40px' }}>
        {/* Info Banner */}
        <div style={{ marginBottom: '16px' }}>
          <InfoBanner>
            {formatNumber(excludedCount)} zero-quantity records excluded from analysis (no revenue impact)
          </InfoBanner>
        </div>

        {/* Anomaly Alert */}
        {anomalyDetected && (
          <div style={{ marginBottom: '24px' }}>
            <AlertBanner type="warning">
              <strong>Data Anomaly Detected:</strong> August and September have identical revenue
              ({formatCurrency(anomalyValue)} each). This appears to be duplicate data —
              all 10,480 records match exactly. One month should be excluded from analysis.
            </AlertBanner>
          </div>
        )}

        {/* KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <KPICard
            label="Total Revenue"
            value={formatCurrency(kpis.revenue)}
            subtext={`${formatNumber(kpis.transactions)} transactions`}
            highlight
          />
          <KPICard
            label="Units Sold"
            value={formatNumber(kpis.units)}
            subtext={`Avg ${(kpis.units / (kpis.transactions || 1)).toFixed(1)} per txn`}
          />
          <KPICard
            label="Unique Customers"
            value={formatNumber(kpis.customers)}
            subtext={`${(kpis.transactions / (kpis.customers || 1)).toFixed(1)} txns/customer`}
          />
          <KPICard
            label="Avg Transaction"
            value={formatCurrency(kpis.avgTransaction)}
          />
          <KPICard
            label="Showing"
            value={`${formatNumber(filteredData.length)}`}
            subtext={`of ${formatNumber(data.length)} records`}
          />
        </div>

        {/* Charts Row 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Monthly Revenue Trend */}
          <div style={{
            backgroundColor: colors.card,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: colors.text.primary }}>
              Monthly Revenue Trend
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 12 }}
                  />
                  <YAxis
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 11 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  {showAnomalyLine && (
                    <ReferenceLine
                      y={anomalyValue}
                      stroke={colors.chart.anomaly}
                      strokeDasharray="5 5"
                      label={{
                        value: 'Duplicate',
                        position: 'right',
                        fill: colors.chart.anomaly,
                        fontSize: 11
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={colors.brand.teal}
                    strokeWidth={3}
                    dot={{ fill: colors.brand.teal, r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Product */}
          <div style={{
            backgroundColor: colors.card,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: colors.text.primary }}>
              Revenue by Product
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 10 }}
                    tickFormatter={formatCurrency}
                  />
                  <YAxis
                    type="category"
                    dataKey="product"
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 11 }}
                    width={75}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
                    {productData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? colors.brand.purple : index < 4 ? colors.brand.teal : colors.chart.secondary}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          {/* Revenue by State */}
          <div style={{
            backgroundColor: colors.card,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: colors.text.primary }}>
              Top 10 States by Revenue
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stateData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} vertical={false} />
                  <XAxis
                    dataKey="state"
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 11 }}
                  />
                  <YAxis
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 11 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]} name="Revenue">
                    {stateData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? colors.brand.teal : index < 4 ? colors.brand.gold : colors.chart.secondary}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by City */}
          <div style={{
            backgroundColor: colors.card,
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: colors.text.primary }}>
              Top 10 Cities by Revenue
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 10 }}
                    tickFormatter={formatCurrency}
                  />
                  <YAxis
                    type="category"
                    dataKey="city"
                    stroke={colors.text.muted}
                    tick={{ fill: colors.text.secondary, fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
                    {cityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? colors.brand.teal : index < 3 ? colors.brand.gold : colors.chart.secondary}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Quality Summary */}
        <div style={{
          marginTop: '32px',
          backgroundColor: colors.card,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: colors.text.primary }}>
            Data Quality Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              {
                label: 'Zero Qty Excluded',
                value: excludedCount,
                pct: ((excludedCount / rawData.length) * 100).toFixed(1),
                highlight: true
              },
              {
                label: 'Missing Location',
                value: data.filter(d => !d.city || !d.state || !d.zip).length,
                pct: ((data.filter(d => !d.city || !d.state || !d.zip).length / data.length) * 100).toFixed(1),
                highlight: false
              },
              {
                label: 'APO/DPO Records (AE)',
                value: data.filter(d => d.state === 'AE').length,
                pct: '-',
                highlight: false
              },
              {
                label: 'June (Single Day)',
                value: data.filter(d => d.year_month === '2025-06').length,
                pct: ((data.filter(d => d.year_month === '2025-06').length / data.length) * 100).toFixed(1),
                highlight: false
              }
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px',
                backgroundColor: colors.bg,
                borderRadius: '8px',
                borderLeft: item.highlight ? `3px solid ${colors.brand.teal}` : 'none'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: item.highlight ? colors.brand.teal : colors.text.primary }}>
                  {formatNumber(item.value)}
                </div>
                <div style={{ fontSize: '12px', color: colors.text.muted, marginTop: '4px' }}>
                  {item.label} {item.pct !== '-' && `(${item.pct}%)`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Container
export default function InteractiveSalesDashboard() {
  const [rawData, setRawData] = useState(null);

  const [loading, setLoading] = useState(true);

  const processData = useCallback((parsedData) => {
    // Clean and validate data
    const cleanedData = parsedData.map(row => ({
      ...row,
      total_value: parseFloat(row.total_value) || 0,
      quantity: parseInt(row.quantity) || 0,
      price: parseFloat(row.price) || 0
    }));
    setRawData(cleanedData);
    setLoading(false);
  }, []);

  const handleFileLoad = useCallback((parsedData) => {
    processData(parsedData);
  }, [processData]);

  // Auto-load data
  useEffect(() => {
    console.log("Auto-loading CSV...");
    fetch(import.meta.env.BASE_URL + 'cleaned_data.csv')
      .then(response => {
        if (!response.ok) throw new Error("File not found");
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("Parse error:", results.errors);
              setLoading(false);
            } else {
              processData(results.data);
            }
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.warn("Auto-load failed:", err);
        setLoading(false);
      });
  }, [processData]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Loading data...
      </div>
    );
  }

  if (!rawData) {
    return <FileUpload onFileLoad={handleFileLoad} />;
  }

  return <Dashboard rawData={rawData} />;
}