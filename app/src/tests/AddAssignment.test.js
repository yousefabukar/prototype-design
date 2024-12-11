import { render, screen, fireEvent } from '@testing-library/react';
import AddAssignment from '../pages/AddAssignments';

describe('AddAssignment Component', () => {     /* AddAssignment.js Testing */

    /* Tests will be numbered for simplicity (eg AddAssignment>Test1, AddAssignment>Test2...) */
    /* Each testing instance's string will have adequate information for you to understand it's purpose. */

    const mockOnCancel = jest.fn();    // mock function for testing "cancel button" functionality


    /* Test 1 - Initial Render & Basic Structure */ 
    test('Displays the assignment creation form with basic elements', () => {
        render(<AddAssignment onCancel={mockOnCancel} />);
        expect(screen.getByText('Create New Assignment')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
    });

    /* Test 2 - Input Field Testing */ 
    test('handles text input fields correctly', () => {
        render(<AddAssignment onCancel={mockOnCancel} />);
        
        // Get all text inputs in the form
        const inputs = screen.getAllByRole('textbox');
        
        // Test title input field & module code input field
        fireEvent.change(inputs[0], { target: { value: 'New Assignment' } });
        expect(inputs[0].value).toBe('New Assignment');
        fireEvent.change(inputs[1], { target: { value: 'CS101' } });
        expect(inputs[1].value).toBe('CS101');
    });

    /* Test 3 - Resource Selection Testing */ 
    test('handles resource selection correctly', () => {
        render(<AddAssignment onCancel={mockOnCancel} />);
        const dropdowns = screen.getAllByRole('combobox');
        
        // CPU & mem selection
        fireEvent.change(dropdowns[0], { target: { value: '2.0 vCPU' } });
        expect(dropdowns[0].value).toBe('2.0 vCPU');
        fireEvent.change(dropdowns[1], { target: { value: '2GB' } });
        expect(dropdowns[1].value).toBe('2GB');
    });

    /* Test 4 - Cancel Button Testing */ 
    test('handles button interactions correctly', () => {
        render(<AddAssignment onCancel={mockOnCancel} />);
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(mockOnCancel).toHaveBeenCalled();
    });
});