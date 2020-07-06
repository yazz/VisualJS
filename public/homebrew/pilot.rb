class Pilot < Formula
  desc "The flexible, powerful and beautiful programming language"
  homepage "https://yazz.com"
  url "http://0.0.0.0/yazz.zip"
  sha256 ""

  def install
      system "./node", "src/electron.js"
  end


end
