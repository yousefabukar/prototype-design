import { render, screen, fireEvent } from '@testing-library/react';
import ListOfAssignments from '../ListOfAssignments';

describe('ListOfAssignments Component', () => {     /* ListOfAssignments.js Testing */

    /* Tests will be numbered for simplicity (eg ListOfAssignments>Test 1, ListOfAssignments>Test 2...) */
    /* Each testing instance's string will have adequate information for you to understand it's purpose. */



    /* Test 1 - Initial Render & UI Elements */ 
    test('displays the main assignment list view with basic UI elements', () => {

        render(<ListOfAssignments />);
        
        expect(screen.getByText('FNCS (Flexible New Code Submission)')).toBeInTheDocument();
        expect(screen.getByText('Assignment List')).toBeInTheDocument();
        
        // Verify the button exists
        expect(screen.getByText('+ Add New Assignment')).toBeInTheDocument();
        
        // Check data is displayed
        expect(screen.getByText('Homework')).toBeInTheDocument();
        expect(screen.getByText('Functional Programming')).toBeInTheDocument();
    });

    /* Test 2 - Button Functionality */ 
    test('switches to AddAssignment component when Add New Assignment is clicked', () => {
        render(<ListOfAssignments />);
        fireEvent.click(screen.getByText('+ Add New Assignment'));
        expect(screen.getByText('Create New Assignment')).toBeInTheDocument();
    });
});