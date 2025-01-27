"use client";

import { useState, ChangeEvent } from "react";

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: "open" | "resolved";
  numEvents: number;
  numUsers: number;
  value: number;
};

type CheckedState = {
  checked: boolean;
  backgroundColor: string;
};

type TableProps = {
  issues: Issue[];
};

const Table = ({ issues }: TableProps) => {
  const initialCheckedState = issues.map((issue) => ({
    checked: false,
    backgroundColor: "#ffffff",
  }));

  const [checkedState, setCheckedState] = useState<CheckedState[]>(initialCheckedState);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedValueSum, setSelectedValueSum] = useState(0);

  // Utility to calculate the sum of selected values
  const calculateSelectedValueSum = (state: CheckedState[]): number =>
    state.reduce((sum, item, index) => {
      return item.checked ? sum + issues[index].value : sum;
    }, 0);

  const handleCheckboxChange = (index: number): void => {
    const updatedState = [...checkedState];
    const current = updatedState[index];

    // Toggle checkbox state and update color
    updatedState[index] = {
      ...current,
      checked: !current.checked,
      backgroundColor: current.checked ? "#ffffff" : "#eeeeee",
    };

    setCheckedState(updatedState);

    const totalSelected = calculateSelectedValueSum(updatedState);
    setSelectedValueSum(totalSelected);

    updateSelectAllState(updatedState, totalSelected);
  };

  const updateSelectAllState = (state: CheckedState[], totalSelected: number): void => {
    // Removed unnecessary manual loops by using filter for open issues.
    const totalOpenIssues = issues.filter((issue) => issue.status === "open").length;

    const selectAllCheckbox = document.getElementById(
      "select-all-checkbox"
    ) as HTMLInputElement;

    if (!selectAllCheckbox) return;

    selectAllCheckbox.indeterminate = totalSelected > 0 && totalSelected < totalOpenIssues;
    setSelectAllChecked(totalSelected === totalOpenIssues);
  };

  const handleSelectAllChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;

    // Using Array.fill creates references to the same object, leading to potential bugs.
    const updatedState = issues.map((issue) => ({
      checked: checked && issue.status === "open",
      backgroundColor: checked && issue.status === "open" ? "#eeeeee" : "#ffffff",
    }));

    setCheckedState(updatedState);

    const totalSelected = calculateSelectedValueSum(updatedState);
    setSelectedValueSum(totalSelected);
    setSelectAllChecked(checked);
  };

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              className="w-5 h-5 cursor-pointer"
              type="checkbox"
              id="select-all-checkbox"
              name="select-all-checkbox"
              value="select-all-checkbox"
              checked={selectAllChecked}
              onChange={handleSelectAllChange}
            />
          </th>
          <th className="py-6 min-w-[8rem] text-left text-black">
            {selectedValueSum ? `Selected ${selectedValueSum}` : "None selected"}
          </th>
          <th colSpan={2} />
        </tr>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6" />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>
      <tbody>
        {issues.map(({ name, message, status }, index) => {
          const issueIsOpen = status === "open";
          const rowClass = `border-b border-gray-200 ${
            checkedState[index].checked ? "bg-blue-50" : ""
          } ${issueIsOpen ? "cursor-pointer hover:bg-blue-50 text-black" : "text-gray-600 cursor-not-allowed"}`;

          return (
            <tr className={rowClass} key={index}>
              <td className="py-6 pl-6">
                <input
                  className="w-5 h-5 cursor-pointer"
                  type="checkbox"
                  id={`checkbox-${index}`}
                  name={name}
                  value={name}
                  checked={checkedState[index].checked}
                  disabled={!issueIsOpen}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-[15px] h-[15px] rounded-full ${
                      issueIsOpen ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      issueIsOpen ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
