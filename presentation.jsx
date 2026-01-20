import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ComposedChart, Area, Legend } from 'recharts';

// Brand Color Palette
const colors = {
  brand: {
    purple: '#5e2d91',      // Primary brand
    gold: '#F9AB21',        // Accent/highlight
    teal: '#80ceca',        // Secondary highlight
  },
  neutral: {
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    black: '#000000',
  },
  semantic: {
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#10b981',
  }
};

// Format currency
const formatCurrency = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: colors.neutral.gray800, 
        padding: '12px 16px', 
        borderRadius: '8px',
        border: `1px solid ${colors.neutral.gray600}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        <p style={{ color: colors.neutral.gray300, marginBottom: '4px', fontSize: '12px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || colors.neutral.white, fontWeight: 600, fontSize: '14px' }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name.includes('Revenue') 
              ? `$${entry.value.toLocaleString()}` 
              : entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Section component - Light
const Section = ({ children }) => (
  <section style={{
    minHeight: '100vh',
    padding: '80px 40px',
    backgroundColor: colors.neutral.white,
    color: colors.neutral.gray800,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  </section>
);

// Section component - Dark (brand purple)
const SectionDark = ({ children }) => (
  <section style={{
    minHeight: '100vh',
    padding: '80px 40px',
    backgroundColor: colors.brand.purple,
    color: colors.neutral.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  </section>
);

// Title slide
const TitleSlide = () => (
  <SectionDark>
    <div style={{ textAlign: 'center' }}>
      <p style={{ 
        color: colors.brand.teal, 
        fontSize: '14px', 
        fontWeight: 600, 
        letterSpacing: '3px',
        marginBottom: '24px',
        textTransform: 'uppercase'
      }}>
        Sales Analysis
      </p>
      <h1 style={{ 
        fontSize: '56px', 
        fontWeight: 300, 
        lineHeight: 1.1,
        marginBottom: '24px',
        color: colors.neutral.white
      }}>
        H2 2025 Performance Review
      </h1>
      <p style={{ 
        fontSize: '24px', 
        color: 'rgba(255,255,255,0.7)',
        maxWidth: '700px',
        margin: '0 auto 48px auto',
        lineHeight: 1.6
      }}>
        Analysis of 65,173 sales transactions across 10 products in our New Mexico market and beyond.
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '48px',
        marginTop: '64px'
      }}>
        {[
          { value: '$1.49M', label: 'H2 Revenue' },
          { value: '10,452', label: 'Customers' },
          { value: 'Jul–Dec', label: '2025' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 600, 
              color: colors.brand.gold,
              marginBottom: '8px'
            }}>{stat.value}</div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <p style={{ 
        fontSize: '12px', 
        color: 'rgba(255,255,255,0.4)',
        marginTop: '32px'
      }}>
        * Excludes 7,574 zero-quantity records
      </p>
    </div>
  </SectionDark>
);

// Executive Summary (Analysis First)
const ExecutiveSummarySlide = () => {
  const highlights = [
    { 
      metric: '$1.49M',
      label: 'H2 Revenue',
      detail: 'July through December 2025',
      accent: true
    },
    { 
      metric: '30%',
      label: 'Pears Share',
      detail: 'Top product by revenue',
      accent: false
    },
    { 
      metric: '61%',
      label: 'New Mexico',
      detail: 'Core market concentration',
      accent: false
    },
    { 
      metric: '-74%',
      label: 'October Dip',
      detail: 'From July peak',
      accent: false
    }
  ];

  return (
    <Section>
      <p style={{ 
        color: colors.brand.purple, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Executive Summary
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.gray800
      }}>
        Four key takeaways.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: colors.neutral.gray500,
        marginBottom: '48px',
        maxWidth: '700px'
      }}>
        Here's what the H2 2025 sales data tells us about product performance, market concentration, and seasonal patterns.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        {highlights.map((item, i) => (
          <div key={i} style={{
            padding: '32px',
            backgroundColor: item.accent ? colors.brand.purple : colors.neutral.gray100,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '40px', 
              fontWeight: 600, 
              color: item.accent ? colors.brand.teal : colors.brand.purple,
              marginBottom: '8px'
            }}>{item.metric}</div>
            <div style={{ 
              fontSize: '14px', 
              color: item.accent ? colors.neutral.white : colors.neutral.gray700,
              fontWeight: 600,
              marginBottom: '4px'
            }}>{item.label}</div>
            <div style={{ 
              fontSize: '12px', 
              color: item.accent ? 'rgba(255,255,255,0.7)' : colors.neutral.gray400
            }}>{item.detail}</div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// Product Performance (excluding zero qty: Pears $445K, Blueberries $237K, etc. - same since 0 qty = $0 value)
const ProductSlide = () => {
  const productData = [
    { product: 'Pears', revenue: 445450, pct: 30 },
    { product: 'Blueberries', revenue: 237186, pct: 16 },
    { product: 'Apples', revenue: 190904, pct: 13 },
    { product: 'Ugli Fruit', revenue: 187534, pct: 13 },
    { product: 'Kiwi', revenue: 150933, pct: 10 },
    { product: 'Bananas', revenue: 88802, pct: 6 },
    { product: 'Carrots', revenue: 73858, pct: 5 },
    { product: 'Apricot', revenue: 60454, pct: 4 },
    { product: 'Grapes', revenue: 47146, pct: 3 },
    { product: 'Plums', revenue: 5008, pct: 0 }
  ];

  return (
    <Section>
      <p style={{ 
        color: colors.brand.purple, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Product Performance
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.gray800
      }}>
        Pears dominate at 30% of revenue.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: colors.neutral.gray500,
        marginBottom: '48px',
        maxWidth: '700px'
      }}>
        The top 4 products (Pears, Blueberries, Apples, Ugli Fruit) account for 72% of total sales.
      </p>

      <div style={{ height: '450px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={productData} 
            layout="vertical"
            margin={{ top: 0, right: 80, left: 80, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.gray200} horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              stroke={colors.neutral.gray400}
              tick={{ fill: colors.neutral.gray600, fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              type="category"
              dataKey="product"
              stroke={colors.neutral.gray400}
              tick={{ fill: colors.neutral.gray600, fontSize: 14 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
              {productData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? colors.brand.purple : index < 4 ? colors.brand.teal : colors.neutral.gray300} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        marginTop: '24px',
        padding: '16px 24px',
        backgroundColor: `${colors.brand.gold}15`,
        borderRadius: '8px',
        borderLeft: `4px solid ${colors.brand.gold}`,
        display: 'inline-block'
      }}>
        <span style={{ color: colors.neutral.gray600, fontSize: '14px' }}>
          💡 Pears have highest unit price ($14.40) — driving high revenue despite moderate volume
        </span>
      </div>
    </Section>
  );
};

// Geographic Distribution
const GeographySlide = () => {
  const stateData = [
    { state: 'New Mexico', revenue: 904665, pct: 61 },
    { state: 'Colorado', revenue: 113431, pct: 8 },
    { state: 'Texas', revenue: 96396, pct: 6 },
    { state: 'California', revenue: 89137, pct: 6 },
    { state: 'Arizona', revenue: 48639, pct: 3 },
    { state: 'Other (45 states)', revenue: 235007, pct: 16 }
  ];

  const cityData = [
    { city: 'Albuquerque', revenue: 346463, pct: 23 },
    { city: 'Farmington', revenue: 70447, pct: 5 },
    { city: 'Rio Rancho', revenue: 68950, pct: 5 },
    { city: 'Los Lunas', revenue: 45182, pct: 3 },
    { city: 'Las Cruces', revenue: 35250, pct: 2 },
  ];

  return (
    <SectionDark>
      <p style={{ 
        color: colors.brand.teal, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Geographic Distribution
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.white
      }}>
        New Mexico is our core market.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '48px',
        maxWidth: '700px'
      }}>
        61% of revenue comes from NM. Albuquerque alone represents 23% of total sales.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        <div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '24px'
          }}>Revenue by State</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stateData} 
                layout="vertical"
                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
              >
                <XAxis 
                  type="number"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  tickFormatter={formatCurrency}
                />
                <YAxis 
                  type="category"
                  dataKey="state"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
                  {stateData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? colors.brand.teal : index < 4 ? colors.brand.gold : 'rgba(255,255,255,0.3)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '24px'
          }}>Top Cities (NM)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={cityData} 
                layout="vertical"
                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
              >
                <XAxis 
                  type="number"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  tickFormatter={formatCurrency}
                />
                <YAxis 
                  type="category"
                  dataKey="city"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} name="Revenue">
                  {cityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? colors.brand.teal : colors.brand.gold} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px',
        padding: '16px 24px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        borderLeft: `4px solid ${colors.brand.teal}`
      }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
          📍 Note: 14 records coded as "AE" represent APO/DPO addresses (military and diplomatic post offices) — potentially a segment worth tracking
        </span>
      </div>
    </SectionDark>
  );
};

// Monthly Revenue Trend
const MonthlyTrendSlide = () => {
  const monthlyData = [
    { month: 'July', revenue: 327760, fill: colors.brand.teal },
    { month: 'August', revenue: 151475, fill: colors.semantic.danger },
    { month: 'September', revenue: 151475, fill: colors.semantic.danger },
    { month: 'October', revenue: 85672, fill: colors.brand.gold },
    { month: 'November', revenue: 236410, fill: colors.brand.teal },
    { month: 'December', revenue: 309830, fill: colors.brand.teal }
  ];

  return (
    <Section>
      <p style={{ 
        color: colors.brand.purple, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Monthly Trends
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.gray800
      }}>
        October shows a significant dip.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: colors.neutral.gray500,
        marginBottom: '48px',
        maxWidth: '700px'
      }}>
        Revenue drops 74% from July to October, then recovers strongly through year-end.
        Note: August and September have a data quality issue (covered later).
      </p>

      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.gray200} vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke={colors.neutral.gray400}
              tick={{ fill: colors.neutral.gray600, fontSize: 14 }}
              axisLine={{ stroke: colors.neutral.gray300 }}
            />
            <YAxis 
              stroke={colors.neutral.gray400}
              tick={{ fill: colors.neutral.gray600, fontSize: 12 }}
              axisLine={{ stroke: colors.neutral.gray300 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} name="Revenue">
              {monthlyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ 
        display: 'flex',
        gap: '24px',
        marginTop: '24px'
      }}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: `${colors.brand.teal}20`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: colors.brand.teal, borderRadius: '2px' }}></div>
          <span style={{ color: colors.neutral.gray600, fontSize: '13px' }}>Strong months</span>
        </div>
        <div style={{
          padding: '12px 16px',
          backgroundColor: `${colors.brand.gold}15`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: colors.brand.gold, borderRadius: '2px' }}></div>
          <span style={{ color: colors.neutral.gray600, fontSize: '13px' }}>October dip — worth investigating</span>
        </div>
        <div style={{
          padding: '12px 16px',
          backgroundColor: `${colors.semantic.danger}15`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: colors.semantic.danger, borderRadius: '2px' }}></div>
          <span style={{ color: colors.neutral.gray600, fontSize: '13px' }}>Aug/Sep data anomaly</span>
        </div>
      </div>
    </Section>
  );
};

// Seasonal Pattern by Product
const SeasonalSlide = () => {
  const productMonthly = [
    { month: 'Jul', Pears: 97862, Blueberries: 52252, Apples: 42106, 'Ugli Fruit': 41783 },
    { month: 'Aug', Pears: 45706, Blueberries: 24304, Apples: 19263, 'Ugli Fruit': 18812 },
    { month: 'Oct', Pears: 25646, Blueberries: 13922, Apples: 11175, 'Ugli Fruit': 10422 },
    { month: 'Nov', Pears: 71453, Blueberries: 37269, Apples: 30401, 'Ugli Fruit': 29794 },
    { month: 'Dec', Pears: 91714, Blueberries: 49711, Apples: 39762, 'Ugli Fruit': 39406 },
  ];

  return (
    <Section>
      <p style={{ 
        color: colors.brand.purple, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Product Seasonality
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.gray800
      }}>
        All products follow the same pattern.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: colors.neutral.gray500,
        marginBottom: '48px',
        maxWidth: '700px'
      }}>
        July peak → October trough → Holiday recovery. This suggests external factors (seasonality, promotions, or market conditions) rather than product-specific issues.
      </p>

      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={productMonthly} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral.gray200} vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke={colors.neutral.gray400}
              tick={{ fill: colors.neutral.gray600, fontSize: 14 }}
            />
            <YAxis 
              stroke={colors.neutral.gray400}
              tick={{ fill: colors.neutral.gray600, fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: colors.neutral.gray600, fontSize: '12px' }}>{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="Pears" 
              stroke={colors.brand.purple} 
              strokeWidth={3}
              dot={{ fill: colors.brand.purple, r: 5 }}
              name="Pears"
            />
            <Line 
              type="monotone" 
              dataKey="Blueberries" 
              stroke={colors.brand.teal}
              strokeWidth={2}
              dot={{ fill: colors.brand.teal, r: 4 }}
              name="Blueberries"
            />
            <Line 
              type="monotone" 
              dataKey="Apples" 
              stroke={colors.brand.gold}
              strokeWidth={2}
              dot={{ fill: colors.brand.gold, r: 4 }}
              name="Apples"
            />
            <Line 
              type="monotone" 
              dataKey="Ugli Fruit" 
              stroke={colors.neutral.gray400}
              strokeWidth={2}
              dot={{ fill: colors.neutral.gray400, r: 4 }}
              name="Ugli Fruit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
};

// Data Quality Section (Now comes after analysis)
const DataQualitySlide = () => {
  const issues = [
    { 
      severity: 'critical',
      title: 'August & September Identical',
      detail: '10,480 records duplicated — same customers, products, quantities, and revenue ($151,475.41 each). This affects 29% of H2 data.',
      impact: '$151K double-counted',
      color: colors.semantic.danger
    },
    { 
      severity: 'excluded',
      title: 'Zero-Quantity Records Excluded',
      detail: '7,574 records with quantity = 0 were excluded from this analysis. They contribute no revenue and add noise to metrics.',
      impact: 'Cleaned from analysis',
      color: colors.brand.teal
    },
    { 
      severity: 'info',
      title: '6.5% Missing Location Data',
      detail: '4,744 records have null city, state, or zip code. Cannot be attributed to geography.',
      impact: 'Incomplete geo analysis',
      color: colors.neutral.gray400
    },
    { 
      severity: 'note',
      title: 'June Contains Only June 30',
      detail: 'All 10,478 June records are dated June 30. Since our H2 analysis starts in July, this is noted but doesn\'t affect our core findings.',
      impact: 'Outside H2 scope',
      color: colors.neutral.gray400
    }
  ];

  return (
    <Section>
      <p style={{ 
        color: colors.semantic.danger, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Data Quality Notes
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.gray800
      }}>
        Issues to address.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: colors.neutral.gray500,
        marginBottom: '48px',
        maxWidth: '600px'
      }}>
        The analysis accounts for these issues. Here's what needs attention.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {issues.map((issue, i) => (
          <div key={i} style={{
            backgroundColor: colors.neutral.gray100,
            borderRadius: '12px',
            padding: '28px',
            borderLeft: `4px solid ${issue.color}`
          }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              marginBottom: '8px',
              color: colors.neutral.gray800
            }}>{issue.title}</div>
            <p style={{ 
              fontSize: '14px', 
              color: colors.neutral.gray500,
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>{issue.detail}</p>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: `${issue.color}15`,
              color: issue.color,
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {issue.impact}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// Anomaly Deep Dive
const AnomalySlide = () => (
  <SectionDark>
    <p style={{ 
      color: colors.semantic.danger, 
      fontSize: '12px', 
      fontWeight: 600, 
      letterSpacing: '2px',
      marginBottom: '16px',
      textTransform: 'uppercase'
    }}>
      The Aug/Sep Anomaly
    </p>
    <h2 style={{ 
      fontSize: '42px', 
      fontWeight: 300, 
      marginBottom: '16px',
      color: colors.neutral.white
    }}>
      $151,475.41 — to the penny.
    </h2>
    <p style={{ 
      fontSize: '18px', 
      color: 'rgba(255,255,255,0.7)',
      marginBottom: '48px',
      maxWidth: '700px'
    }}>
      When two months have identical revenue, that's not a trend — it's a data issue. All 10,480 records match exactly: same customers, same products, same quantities.
    </p>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '40px',
      marginBottom: '48px'
    }}>
      <div style={{ 
        padding: '32px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>If Duplicate Included</div>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 300,
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'line-through'
        }}>$1.49M</div>
      </div>
      <div style={{ 
        padding: '32px',
        backgroundColor: `${colors.brand.teal}20`,
        borderRadius: '12px',
        textAlign: 'center',
        border: `2px solid ${colors.brand.teal}`
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: colors.brand.teal,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>If Duplicate Removed</div>
        <div style={{ 
          fontSize: '48px', 
          fontWeight: 300,
          color: colors.brand.teal
        }}>$1.34M</div>
      </div>
    </div>

    <div style={{ 
      padding: '20px 24px',
      backgroundColor: `${colors.semantic.danger}20`,
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.semantic.danger}`
    }}>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
        <strong style={{ color: colors.semantic.danger }}>Recommendation:</strong> Verify with source system which month (August or September) contains the correct data. One month should be excluded from reporting.
      </p>
    </div>
  </SectionDark>
);

// Questions Slide
const QuestionsSlide = () => {
  const questions = [
    {
      category: 'Data Quality',
      items: [
        'Which month (August or September) contains the correct data?',
        'What do zero-quantity transactions represent — cancellations, returns, or placeholders?'
      ]
    },
    {
      category: 'Business Context',
      items: [
        'What caused the 74% revenue drop in October?',
        'Are the APO/DPO (AE) records from military members — a segment worth tracking?'
      ]
    }
  ];

  return (
    <Section>
      <p style={{ 
        color: colors.brand.purple, 
        fontSize: '12px', 
        fontWeight: 600, 
        letterSpacing: '2px',
        marginBottom: '16px',
        textTransform: 'uppercase'
      }}>
        Next Steps
      </p>
      <h2 style={{ 
        fontSize: '42px', 
        fontWeight: 300, 
        marginBottom: '16px',
        color: colors.neutral.gray800
      }}>
        Questions for the business.
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: colors.neutral.gray500,
        marginBottom: '48px',
        maxWidth: '700px'
      }}>
        These questions would help move from "what the data shows" to "what it means."
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {questions.map((group, i) => (
          <div key={i}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: colors.brand.purple,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>{group.category}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {group.items.map((item, j) => (
                <div key={j} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: colors.brand.teal,
                    color: colors.neutral.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>{j + 1}</div>
                  <p style={{ 
                    color: colors.neutral.gray600, 
                    fontSize: '16px',
                    lineHeight: 1.5,
                    margin: 0
                  }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '64px',
        padding: '24px 32px',
        backgroundColor: colors.neutral.gray100,
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: colors.neutral.gray600, 
          fontSize: '16px',
          margin: 0
        }}>
          <strong style={{ color: colors.brand.purple }}>Bottom line:</strong> Strong New Mexico performance with clear product leaders. 
          Resolve the Aug/Sep data issue to unlock confident trend analysis.
        </p>
      </div>
    </Section>
  );
};

// Final Summary
const SummarySlide = () => (
  <SectionDark>
    <div style={{ textAlign: 'center' }}>
      <p style={{ 
        color: colors.brand.teal, 
        fontSize: '14px', 
        fontWeight: 600, 
        letterSpacing: '3px',
        marginBottom: '24px',
        textTransform: 'uppercase'
      }}>
        Summary
      </p>
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: 300, 
        lineHeight: 1.2,
        marginBottom: '48px',
        color: colors.neutral.white,
        maxWidth: '800px',
        margin: '0 auto 48px auto'
      }}>
        $1.49M in H2 revenue, led by Pears (30%) and anchored in New Mexico (61%).
      </h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '48px',
        marginTop: '64px'
      }}>
        {[
          { value: 'Pears', label: 'Top Product' },
          { value: 'Albuquerque', label: 'Top City (23%)' },
          { value: 'October', label: 'Needs Investigation' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 600, 
              color: i === 0 ? colors.brand.teal : colors.brand.gold,
              marginBottom: '8px'
            }}>{stat.value}</div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </SectionDark>
);

// Main App
export default function SalesPresentationDashboard() {
  return (
    <div style={{ 
      fontFamily: "'Source Sans 3', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: colors.neutral.white,
      minHeight: '100vh'
    }}>
      <TitleSlide />
      <ExecutiveSummarySlide />
      <ProductSlide />
      <GeographySlide />
      <MonthlyTrendSlide />
      <SeasonalSlide />
      <DataQualitySlide />
      <AnomalySlide />
      <QuestionsSlide />
      <SummarySlide />
    </div>
  );
}