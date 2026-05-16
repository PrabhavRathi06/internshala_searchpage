import React, { useState, useEffect } from 'react';
import InternshipCard from './InternshipCard';
import '../styles/InternshipList.css';

const ITEMS_PER_PAGE = 5;

const InternshipList = ({ internships }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the filters/internships change
  useEffect(() => {
    setCurrentPage(1);
  }, [internships]);

  if (internships.length === 0) {
    return (
      <div className="no-results">
        <p>No internships found matching your filters.</p>
        <p>Try adjusting your search criteria.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(internships.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentInternships = internships.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="internship-list-container">
      {currentInternships.map((internship) => (
        <div key={internship.id}>
          <InternshipCard internship={internship} />
        </div>
      ))}
      
      {totalPages > 1 && (
        <div className="pagination-container">
          <span 
            className={`page-nav ${currentPage === 1 ? 'disabled' : ''}`} 
            onClick={handlePrevPage}
          >
            &lt; Previous
          </span>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <span 
              key={page} 
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </span>
          ))}

          <span 
            className={`page-nav ${currentPage === totalPages ? 'disabled' : 'active-nav'}`} 
            onClick={handleNextPage}
          >
            Next &gt;
          </span>
        </div>
      )}

      <div className="seo-footer">
        <h3 className="seo-title">Apply to {internships.length} Internships on Internshala.com</h3>
        <div className="seo-grid">
          <div className="seo-column">
            <h4>Internships by Profile</h4>
            <ul>
              <li>Marketing Internships</li>
              <li>Content Writing Internships</li>
              <li>Computer Science Internships</li>
            </ul>
          </div>
          <div className="seo-column">
            <h4>Internships by Location</h4>
            <ul>
              <li>Work From Home Internships</li>
              <li>Internships in Delhi</li>
              <li>Internships in Bangalore</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipList;
