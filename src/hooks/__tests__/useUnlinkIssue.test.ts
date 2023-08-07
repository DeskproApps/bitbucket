import { cleanup, renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { deleteEntityService } from "../../services/deskpro";
import { useUnlinkIssue } from "../useUnlinkIssue";
import { mockIssues } from "../../../testing";
import type { Result } from "../useUnlinkIssue";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock("../useAsyncError", () => ({
  useAsyncError: jest.fn().mockReturnValue({ asyncErrorHandler: jest.fn() }),
}));
jest.mock("../../services/deskpro/deleteEntityService");

describe("useUnlinkIssue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should unlink issue", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (deleteEntityService as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook<Result, unknown>(() => useUnlinkIssue());

    await act(async () => {
      await result.current.unlink(mockIssues.values[0] as never);
    })

    expect(deleteEntityService).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("shouldn't navigate to /home if unlink issue failed", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (deleteEntityService as jest.Mock).mockRejectedValueOnce(new Error("unlink failed"));

    const { result } = renderHook<Result, unknown>(() => useUnlinkIssue());

    await act(async () => {
      await result.current.unlink(mockIssues.values[0] as never);
    });

    expect(deleteEntityService).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith("/home");
  });

  test("shouldn't navigate to /home if no issue", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (deleteEntityService as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook<Result, unknown>(() => useUnlinkIssue());

    await act(async () => {
      await result.current.unlink();
    });

    expect(deleteEntityService).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith("/home");
  });
});
