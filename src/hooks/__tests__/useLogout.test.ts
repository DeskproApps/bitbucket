import { cleanup, renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { removeAccessTokenService, removeRefreshTokenService } from "../../services/deskpro";
import { useLogout } from "../useLogout";
import type { Result } from "../useLogout";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock("../../services/deskpro/removeAccessTokenService");
jest.mock("../../services/deskpro/removeRefreshTokenService");

describe("useLogout", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should remove token and navigate to login page", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (removeAccessTokenService as jest.Mock).mockResolvedValueOnce("");
    (removeRefreshTokenService as jest.Mock).mockResolvedValueOnce("");

    const { result } = renderHook<Result, unknown>(() => useLogout());

    await act(async () => {
      await result.current.logout();
    })

    expect(removeAccessTokenService).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("should navigate to the login page even if the remove token failed", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (removeAccessTokenService as jest.Mock).mockRejectedValueOnce("");
    (removeRefreshTokenService as jest.Mock).mockResolvedValueOnce("");

    const { result } = renderHook<Result, unknown>(() => useLogout());

    await act(async () => {
      await result.current.logout();
    })

    expect(removeAccessTokenService).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
