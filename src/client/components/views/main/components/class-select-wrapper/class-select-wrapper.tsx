import * as React from "react";

import { LockSelectionChoice } from "../../../../../../types/api";
import {
  WowClassSafeName,
  WowSpecSafeName
} from "../../../../../../types/classes";
import ClassSelect from "../class-select";
import CommentsBox from "../comments-box";

import * as STYLES from "./class-select-wrapper.scss";

export type NoneableLockSelectionChoice = LockSelectionChoice | "none";

interface ClassSelectWrapperProps {
  description?: string;
  selectedClass?: WowClassSafeName;
  selectedSpec?: WowSpecSafeName;
  comments?: string;
  showSelectedClassWarning: boolean;
  onChange: (prop: string, value: any) => any;
  isLocked?: boolean;
  lockedChoice?: NoneableLockSelectionChoice;
}

const ClassSelectWrapper = ({
  description,
  selectedClass,
  selectedSpec,
  comments,
  showSelectedClassWarning,
  onChange,
  isLocked,
  lockedChoice
}: ClassSelectWrapperProps) => {
  const onClassChange = (value: {
    class?: WowClassSafeName;
    spec?: WowSpecSafeName;
  }) => {
    onChange("spec", value.spec);
    onChange("class", value.class);
  };
  const onCommentsChange = (value: string) => onChange("comments", value);

  let selectionWarning: JSX.Element | null = null;
  if (showSelectedClassWarning) {
    selectionWarning = (
      <p className={STYLES.selectionWarning}>
        You do not currently have a character of this class at max level in the
        guild. If you wish to play this class it is your responsibility to
        ensure that it is ready to go for Battle for Azeroth and that you know
        what you're doing!
      </p>
    );
  }

  const wrapperClasses = [STYLES.classSelectWrapper];
  if (isLocked) {
    wrapperClasses.push(STYLES.classSelectWrapper__locked);
    wrapperClasses.push(STYLES[`classSelectWrapper__locked__${lockedChoice}`]);
  }

  let lockDisplay: JSX.Element | null = null;
  if (isLocked) {
    lockDisplay = (
      <div
        className={`${STYLES.lockDisplay} ${
          STYLES[`lockDisplay__${lockedChoice}`]
        }`}
      >
        <div className={STYLES.lockDisplay__inner} />
      </div>
    );
  }

  return (
    <div className={wrapperClasses.join(" ")}>
      {lockDisplay}
      <div className={STYLES.description}>{description}</div>
      <div className={STYLES.elements}>
        <ClassSelect
          onChange={onClassChange}
          selectedClass={selectedClass}
          selectedSpec={selectedSpec}
          isLocked={isLocked}
        />
        <CommentsBox
          onChange={onCommentsChange}
          value={comments}
          isLocked={isLocked}
        />
      </div>
      {selectionWarning}
    </div>
  );
};

export default ClassSelectWrapper;
