import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Search, HelpCircle } from 'lucide-react';
import '../styles/FilterPanel.css';

/* ── Custom Date Picker ── */
const CustomDatePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDate = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  return (
    <div className="custom-datepicker" ref={ref}>
      <div className="datepicker-input" onClick={() => setOpen(!open)}>
        {displayValue || <span className="placeholder-text">Choose date</span>}
      </div>
      {open && (
        <div className="datepicker-dropdown">
          <div className="datepicker-header">
            <button type="button" className="dp-nav-btn" onClick={prevMonth}><ChevronLeft size={16} color="#008bdc" /></button>
            <span className="dp-month-year">{monthNames[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav-btn" onClick={nextMonth}><ChevronRight size={16} color="#008bdc" /></button>
          </div>
          <div className="datepicker-weekdays">
            {['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="datepicker-days">
            {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} className="dp-empty" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === value;
              return (
                <span
                  key={day}
                  className={`dp-day${isToday ? ' dp-today' : ''}${isSelected ? ' dp-selected' : ''}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Custom Dropdown ── */
const CustomDropdown = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div className="custom-dropdown" ref={ref}>
      <div className={`form-control dropdown-trigger${open ? ' dropdown-open' : ''}`} onClick={() => setOpen(!open)}>
        {selected ? <span>{selected.label}</span> : <span className="placeholder-text">{placeholder}</span>}
        <ChevronDown size={14} className="dropdown-chevron" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </div>
      {open && (
        <div className="dropdown-options">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`dropdown-option${opt.value === value ? ' dropdown-option-selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const durationOptions = [
  { value: '1', label: '1 month' },
  { value: '2', label: '2 months' },
  { value: '3', label: '3 months' },
  { value: '4', label: '4 months' },
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '24', label: '24 months' },
  { value: '36', label: '36 months' },
];

/* ── Filter Panel ── */
const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="filters_container">
      <div id="filters">
        <div className="form-container">
          <div className="filterUi">
            <Filter size={16} className="filter_icon" />
            <span className="heading_5">Filters</span>
          </div>
          
          <form id="filter_form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="profile" className="control-label">Profile</label>
              <input 
                type="text" 
                className="form-control" 
                id="profile" 
                name="profile"
                value={filters.profile}
                onChange={handleChange}
                placeholder="e.g. Marketing" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location" className="control-label">Location</label>
              <input 
                type="text" 
                className="form-control" 
                id="location" 
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="e.g. Delhi" 
              />
            </div>

            <div className="filters_checkboxes_containers">
              <div className="form-group">
                <div className="checkbox">
                  <input 
                    type="checkbox" 
                    id="wfh"
                    name="wfh" 
                    checked={filters.wfh} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="wfh">Work from home</label>
                </div>
              </div>
              <div className="form-group">
                <div className="checkbox">
                  <input 
                    type="checkbox" 
                    id="partTime"
                    name="partTime" 
                    checked={filters.partTime} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="partTime">Part-time</label>
                </div>
              </div>
            </div>

            <div className="stipend_filter_container">
              <label htmlFor="stipend_filter" className="control-label">Desired minimum monthly stipend (₹)</label>
              <input 
                type="range" 
                className="slider" 
                id="stipend_filter" 
                name="stipend"
                min="0" 
                max="10000" 
                step="2000"
                value={filters.stipend || 0}
                onChange={handleChange}
                style={{
                  background: `linear-gradient(to right, #008bdc ${((filters.stipend || 0) / 10000) * 100}%, #ddd ${((filters.stipend || 0) / 10000) * 100}%)`
                }}
              />
              <div className="stipend_values_container">
                <span className={`stipend_value ${filters.stipend == 0 ? 'selected_stipend_value' : ''}`}>0</span>
                <span className={`stipend_value ${filters.stipend == 2000 ? 'selected_stipend_value' : ''}`}>2K</span>
                <span className={`stipend_value ${filters.stipend == 4000 ? 'selected_stipend_value' : ''}`}>4K</span>
                <span className={`stipend_value ${filters.stipend == 6000 ? 'selected_stipend_value' : ''}`}>6K</span>
                <span className={`stipend_value ${filters.stipend == 8000 ? 'selected_stipend_value' : ''}`}>8K</span>
                <span className={`stipend_value ${filters.stipend == 10000 ? 'selected_stipend_value' : ''}`}>10K</span>
              </div>
            </div>

            <div className="filter_toggle" onClick={() => setShowMoreFilters(!showMoreFilters)}>
              {showMoreFilters ? 'View less filters' : 'View more filters'}
              <ChevronDown size={14} style={{ transform: showMoreFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {showMoreFilters && (
              <div className="more_filters_container">
                <div className="form-group">
                  <label className="control-label">Starting from (or after)</label>
                  <CustomDatePicker
                    value={filters.startDate}
                    onChange={(val) => onFilterChange('startDate', val)}
                  />
                </div>

                <div className="form-group">
                  <label className="control-label">Max. duration (months)</label>
                  <CustomDropdown
                    value={filters.maxDuration}
                    onChange={(val) => onFilterChange('maxDuration', val)}
                    options={durationOptions}
                    placeholder="Choose duration"
                  />
                </div>

                <div className="filters_checkboxes_containers">
                  <div className="form-group">
                    <div className="checkbox">
                      <input 
                        type="checkbox" 
                        id="jobOffer"
                        name="jobOffer" 
                        checked={filters.jobOffer} 
                        onChange={handleChange} 
                      />
                      <label htmlFor="jobOffer" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        Internships with job offer <HelpCircle size={14} color="#8a8a8a" />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="checkbox">
                      <input 
                        type="checkbox" 
                        id="fastResponse"
                        name="fastResponse" 
                        checked={filters.fastResponse} 
                        onChange={handleChange} 
                      />
                      <label htmlFor="fastResponse" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        Fast response <HelpCircle size={14} color="#8a8a8a" />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="checkbox">
                      <input 
                        type="checkbox" 
                        id="earlyApplicant"
                        name="earlyApplicant" 
                        checked={filters.earlyApplicant} 
                        onChange={handleChange} 
                      />
                      <label htmlFor="earlyApplicant" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        Early applicant <HelpCircle size={14} color="#8a8a8a" />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="checkbox">
                      <input 
                        type="checkbox" 
                        id="women"
                        name="women" 
                        checked={filters.women} 
                        onChange={handleChange} 
                      />
                      <label htmlFor="women" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        Internships for women <HelpCircle size={14} color="#8a8a8a" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="reset_link_container">
              <button className="reset_link_desktop" onClick={onClearFilters}>
                Clear all
              </button>
            </div>
          </form>
        </div>

        <div className="form-container keyword-form-container">
          <div className="keyword-heading heading_5">Keyword Search</div>
          <div className="keywordContainer">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control"
                name="keyword"
                placeholder="e.g. Design, Mumbai, Infosys"
                value={filters.keyword}
                onChange={handleChange}
              />
              <div className="search_btn_container">
                <button className="btn btn-primary">
                  <Search size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
