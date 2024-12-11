import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionsList from '../pages/SubmissionsList';

describe('SubmissionsList Component', () => {     /* SubmissionsList.js Testing */

    /* Tests will be numbered for simplicity (eg SubmissionsList>Test1, SubmissionsList>Test2...) */
    /* Each testing instance's string will have adequate information for you to understand it's purpose. */

    const mockOnBack = jest.fn();    // mock function for testing "back button" fuctionality


    /* Test 1 - Initial Render & Basic Structure */ 
    test('Displays the submission list view with basic UI elements', () => {
        render(<SubmissionsList onBack={mockOnBack} />);

        // Check table headers
        expect(screen.getByText('Student Submissions')).toBeInTheDocument();
        expect(screen.getByText('Submission ID')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        
        // Verify sample data is displayed [WILL ONLY WORK BEFORE THE INTEGRATION OF THE BACKEND]
        expect(screen.getByText('Ruhaan Kadri')).toBeInTheDocument();
        expect(screen.getByText('12/15')).toBeInTheDocument();
    });

    /* Test 2 - Navigation Testing */ 
    test('handles back button navigation correctly', () => {
        render(<SubmissionsList onBack={mockOnBack} />);
        
        // back button intended functionality test
        fireEvent.click(screen.getByText('Back'));
        expect(mockOnBack).toHaveBeenCalled();
    });

    /* Test 3 - Grading View Navigation */ 
    test('switches interface when "Mark" button is clicked', () => {
        render(<SubmissionsList onBack={mockOnBack} />);
        
        // Find and click first Mark button
        const markButtons = screen.getAllByText('Mark');
        fireEvent.click(markButtons[0]);
        expect(screen.getByText(/Grade Submission/)).toBeInTheDocument();
    });
});